// Knowra API Client

const DEFAULT_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : 'https://knowra-ai.onrender.com';

export function getApiBaseUrl() {
  const stored = localStorage.getItem('knowra_api_url');
  // Auto-migrate away from old local development URL if previously stored
  if (stored && (stored.includes('localhost:8000') || stored.includes('127.0.0.1:8000'))) {
    localStorage.removeItem('knowra_api_url');
    return DEFAULT_BASE_URL;
  }
  return stored || DEFAULT_BASE_URL;
}

export function setApiBaseUrl(url) {
  localStorage.setItem('knowra_api_url', url.replace(/\/+$/, ''));
}

export function getAccessToken() {
  return localStorage.getItem('knowra_access_token');
}

export function getRefreshToken() {
  return localStorage.getItem('knowra_refresh_token');
}

export function notifyAuthChange(isAuthenticated) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('knowra_auth_change', {
        detail: {
          isAuthenticated: isAuthenticated !== undefined ? isAuthenticated : isUserLoggedIn(),
          user: getStoredUser(),
        },
      })
    );
  }
}

export function setAuthTokens(accessToken, refreshToken) {
  if (accessToken) localStorage.setItem('knowra_access_token', accessToken);
  if (refreshToken) localStorage.setItem('knowra_refresh_token', refreshToken);
  notifyAuthChange(true);
}

export function clearAuthTokens() {
  localStorage.removeItem('knowra_access_token');
  localStorage.removeItem('knowra_refresh_token');
  localStorage.removeItem('knowra_user');
  notifyAuthChange(false);
}

export function getStoredUser() {
  const data = localStorage.getItem('knowra_user');
  try {
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  localStorage.setItem('knowra_user', JSON.stringify(user));
}

export function parseJwt(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Check if a JWT is expired (or will expire within threshold seconds)
 */
export function isTokenExpired(token, thresholdSeconds = 30) {
  if (!token) return true;
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now + thresholdSeconds;
}

/**
 * True only if a valid, unexpired token exists
 */
export function isUserLoggedIn() {
  const refresh = getRefreshToken();
  if (refresh && !isTokenExpired(refresh)) {
    return true;
  }
  const access = getAccessToken();
  if (access && !isTokenExpired(access)) {
    return true;
  }
  return false;
}

// Automatically clean up stale or expired tokens from previous sessions on startup
if (typeof window !== 'undefined') {
  try {
    const refresh = localStorage.getItem('knowra_refresh_token');
    const access = localStorage.getItem('knowra_access_token');
    if ((refresh || access) && !isUserLoggedIn()) {
      localStorage.removeItem('knowra_access_token');
      localStorage.removeItem('knowra_refresh_token');
      localStorage.removeItem('knowra_user');
    }
  } catch {}
}

/**
 * Concurrency mutex: In-flight refresh promise shared across parallel calls
 */
let refreshPromise = null;

/**
 * Uses the refresh token endpoint (/api/auth/refresh) to acquire fresh tokens.
 * Handles race conditions by sharing an in-flight promise across concurrent callers.
 */
export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearAuthTokens();
    return false;
  }

  // If a refresh request is already pending, return that existing promise
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
          'Accept': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.access_token) {
          setAuthTokens(data.access_token, data.refresh_token);
          return true;
        }
      } else {
        // If refresh token is expired or revoked (401 / 403), wipe local auth state
        if (res.status === 401 || res.status === 403) {
          console.warn('Refresh token is expired or revoked. Logging out user session.');
          clearAuthTokens();
        }
      }
    } catch (e) {
      console.error('Refresh token request failed:', e);
    } finally {
      refreshPromise = null;
    }

    return false;
  })();

  return refreshPromise;
}

/**
 * Helper to ensure a valid access token is available, refreshing if expired
 */
export async function getValidAccessToken() {
  const token = getAccessToken();
  if (!token || isTokenExpired(token)) {
    if (getRefreshToken()) {
      const success = await refreshAccessToken();
      if (success) return getAccessToken();
    }
    return null;
  }
  return token;
}

// Universal fetch wrapper with authorization header & automatic token refresh
async function request(endpoint, options = {}) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  // If not already an auth endpoint, proactively refresh access token if expired
  const isAuthEndpoint = (endpoint.startsWith('/api/v1/auth/') || endpoint.startsWith('/api/auth/') || endpoint.startsWith('/auth/')) && !endpoint.includes('/logout');
  if (!isAuthEndpoint && getRefreshToken()) {
    const currentToken = getAccessToken();
    if (isTokenExpired(currentToken)) {
      await refreshAccessToken();
    }
  }

  const headers = {
    'Accept': 'application/json',
    ...(options.headers || {}),
  };

  // Attach token if present and not explicitly omitted
  const token = getAccessToken();
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is not FormData, default to application/json
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle token expiration & automatic refresh on 401 response
    if (response.status === 401 && getRefreshToken() && !options._retry) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        const retryHeaders = {
          ...headers,
          'Authorization': `Bearer ${getAccessToken()}`,
        };
        // Re-call request with updated auth and retry flag, properly returning parsed JSON!
        return await request(endpoint, {
          ...options,
          headers: retryHeaders,
          _retry: true,
        });
      }
    }

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { detail: `HTTP ${response.status}: ${response.statusText}` };
      }
      const errorMsg = errorData.detail || errorData.message || 'Request failed';
      throw new Error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
    }

    return await response.json();
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, err);
    throw err;
  }
}

// -------------------------------------------------------------
// HEALTH CHECK
// -------------------------------------------------------------
export async function checkBackendHealth(timeoutMs = 60000) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/health`, { method: 'GET', signal: AbortSignal.timeout(timeoutMs) });
    if (res.ok) {
      const data = await res.json();
      return { online: true, data };
    }
    return { online: false };
  } catch {
    return { online: false };
  }
}

// -------------------------------------------------------------
// AUTH ENDPOINTS (/api/v1/auth)
// -------------------------------------------------------------
export async function signupUser({ username, email, password, role = 'member' }) {
  return request('/api/v1/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      user_name: username,
      email,
      password,
      role,
    }),
  });
}

export async function loginUser({ email, password }) {
  const data = await request('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data.access_token) {
    setAuthTokens(data.access_token, data.refresh_token);
    setStoredUser({ email });
  }
  return data;
}

export async function logoutUser() {
  try {
    await request('/api/v1/auth/logout', { method: 'POST' });
  } catch (e) {
    console.warn('Logout notification error:', e);
  } finally {
    clearAuthTokens();
  }
}

export async function requestPasswordReset(email) {
  const cleanEmail = (email || '').trim();
  return request(`/api/v1/auth/password_reset`, {
    method: 'POST',
    body: JSON.stringify({ email: cleanEmail }),
  });
}

export async function confirmPasswordReset({ token, newPassword, confirmNewPassword }) {
  const cleanToken = (token || '').trim();
  return request(`/api/v1/auth/password_reset_confirm/${encodeURIComponent(cleanToken)}`, {
    method: 'POST',
    body: JSON.stringify({
      new_password: newPassword,
      confirm_new_password: confirmNewPassword,
    }),
  });
}

// -------------------------------------------------------------
// BUSINESS ENDPOINTS (/api/v1)
// -------------------------------------------------------------
export async function getAllBusinesses() {
  return request('/api/v1/all_business');
}

export async function getBusinessById(businessId) {
  return request(`/api/v1/business/${businessId}`);
}

export async function createBusiness({ businessName, description = '', websiteUrl = '', publicKey = '' }) {
  return request('/api/v1/create_business', {
    method: 'POST',
    body: JSON.stringify({
      business_name: businessName,
      description: description || undefined,
      website_url: websiteUrl || undefined,
      public_key: publicKey || undefined,
    }),
  });
}

export async function updateBusiness(businessId, { businessName, description, websiteUrl }) {
  return request(`/api/v1/update_business/${businessId}`, {
    method: 'PUT',
    body: JSON.stringify({
      business_name: businessName,
      description,
      website_url: websiteUrl,
    }),
  });
}

export async function deleteBusiness(businessId) {
  return request(`/api/v1/delete_business/${businessId}`, {
    method: 'DELETE',
  });
}

export async function getWidgetInfo(publicKey) {
  return request(`/api/v1/widget/info/${publicKey}`);
}

// -------------------------------------------------------------
// DOCUMENT ENDPOINTS (/api/v1)
// -------------------------------------------------------------
export async function getBusinessDocuments(businessId) {
  return request(`/api/v1/business_document/${businessId}`);
}

export async function getAllDocuments() {
  return request('/api/v1/all_document');
}

export async function getDocumentById(documentId) {
  return request(`/api/v1/document/${documentId}`);
}

export async function uploadDocument(businessId, file) {
  const formData = new FormData();
  formData.append('file', file);

  return request(`/api/v1/create_document/${businessId}`, {
    method: 'POST',
    body: formData,
  });
}

export async function deleteDocument(documentId) {
  return request(`/api/v1/delete_document/${documentId}`, {
    method: 'DELETE',
  });
}

// -------------------------------------------------------------
// CHAT & STREAMING ENDPOINTS (/api/v1)
// -------------------------------------------------------------
export async function getChatHistory(threadId) {
  return request(`/api/v1/history/${threadId}`);
}

export async function clearChatHistory(threadId) {
  return request(`/api/v1/history/${threadId}`, {
    method: 'DELETE',
  });
}

async function processSSEStream(reader, onChunk, onDone) {
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || ''; // Keep partial line in buffer

    for (const line of lines) {
      const trimmedLine = line.trimEnd();
      let raw = null;
      if (trimmedLine.startsWith('data: ')) {
        raw = line.substring(6);
      } else if (trimmedLine.startsWith('data:')) {
        raw = line.substring(5);
      } else if (trimmedLine.startsWith('event: error')) {
        throw new Error('Streaming error from server');
      } else {
        continue;
      }

      if (raw === '[DONE]') {
        if (onDone) onDone();
        return;
      }

      // Handle JSON structured event
      if (raw.startsWith('{')) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.type === 'delta' || parsed.content !== undefined || parsed.delta !== undefined) {
            const text = parsed.content !== undefined ? parsed.content : (parsed.delta || '');
            if (text && onChunk) onChunk(text);
            continue;
          } else if (parsed.type === 'done') {
            if (onDone) onDone();
            return;
          } else if (parsed.type === 'error' || parsed.error) {
            throw new Error(parsed.error || 'A temporary error occurred while generating the response.');
          }
        } catch (e) {
          if (e.message && !e.message.includes('JSON')) {
            throw e;
          }
          // Fall back to treating raw string as chunk
        }
      }

      // Plain text fallback
      if (raw && onChunk) {
        onChunk(raw);
      }
    }
  }

  if (onDone) onDone();
}

/**
 * Stream chat response using SSE from /api/v1/knowra/chat/{business_id}
 */
export async function streamBusinessChat(businessId, message, threadId, onChunk, onDone, onError) {
  const baseUrl = getApiBaseUrl();
  let token = getAccessToken();
  
  if (isTokenExpired(token) && getRefreshToken()) {
    await refreshAccessToken();
    token = getAccessToken();
  }

  const url = `${baseUrl}/api/v1/knowra/chat/${businessId}`;

  try {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        message,
        thread_id: threadId,
      }),
    });

    // Handle token expiration during chat initiation
    if (response.status === 401 && getRefreshToken()) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`,
          },
          body: JSON.stringify({
            message,
            thread_id: threadId,
          }),
        });
      }
    }

    if (!response.ok) {
      let errText = `HTTP ${response.status}`;
      try {
        const json = await response.json();
        errText = json.detail || json.message || errText;
      } catch {}
      throw new Error(errText);
    }

    const reader = response.body.getReader();
    await processSSEStream(reader, onChunk, onDone);
  } catch (err) {
    if (onError) onError(err);
    else throw err;
  }
}

/**
 * Stream public chat response from /api/v1/widget/{public_key}
 */
export async function streamWidgetChat(publicKey, message, threadId, onChunk, onDone, onError) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/api/v1/widget/${publicKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        thread_id: threadId,
      }),
    });

    if (!response.ok) {
      let errText = `HTTP ${response.status}`;
      try {
        const json = await response.json();
        errText = json.detail || json.message || errText;
      } catch {}
      throw new Error(errText);
    }

    const reader = response.body.getReader();
    await processSSEStream(reader, onChunk, onDone);
  } catch (err) {
    if (onError) onError(err);
    else throw err;
  }
}

// -------------------------------------------------------------
// FEATURE: QUESTION CLUSTERING & TOPIC INTELLIGENCE (/api/feature)
// -------------------------------------------------------------
/**
 * Normalizes question cluster analysis results into a clean, uniform array of topic insight objects:
 * Array<{ topic: string, insight: string }>
 * Defensively parses any payload shape: arrays of objects, dictionaries/maps, raw strings,
 * JSON strings, or nested containers, preventing React object-child errors.
 */
export function normalizeClusterInsights(raw) {
  if (!raw) return [];

  let data = raw;
  // If string, try to parse JSON
  if (typeof data === 'string') {
    const trimmed = data.trim();
    if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
      try {
        data = JSON.parse(trimmed);
      } catch {
        return [{ topic: 'Strategic Analysis', insight: trimmed }];
      }
    } else {
      return [{ topic: 'Strategic Analysis', insight: trimmed }];
    }
  }

  // Handle nested wrapper { message: ... } or { topics: ... } or { clusters: ... }
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    if (Array.isArray(data.message)) {
      data = data.message;
    } else if (Array.isArray(data.topics)) {
      data = data.topics;
    } else if (Array.isArray(data.clusters)) {
      data = data.clusters;
    }
  }

  // If array of items
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== null && item !== undefined)
      .map((item, idx) => {
        if (typeof item === 'string') {
          const colonIdx = item.indexOf(':');
          if (colonIdx > 0 && colonIdx < 50) {
            return {
              topic: item.substring(0, colonIdx).trim(),
              insight: item.substring(colonIdx + 1).trim(),
            };
          }
          return {
            topic: `Topic ${idx + 1}`,
            insight: item.trim(),
          };
        }
        if (typeof item === 'object') {
          const topic = item.topic_name || item.topic || item.title || item.name || `Topic ${idx + 1}`;
          let insight = item.insight || item.description || item.summary || item.text || item.solution || '';
          if (typeof insight !== 'string') {
            insight = typeof insight === 'object' ? JSON.stringify(insight, null, 2) : String(insight || '');
          }
          return { topic: String(topic), insight: String(insight) };
        }
        return { topic: `Topic ${idx + 1}`, insight: String(item || '') };
      });
  }

  // If dictionary/map { "Topic 1": "Insight 1" } or { "Topic 1": { insight: "..." } }
  if (data && typeof data === 'object') {
    return Object.entries(data).map(([topic, val], idx) => {
      if (typeof val === 'string') {
        return { topic: String(topic), insight: val };
      }
      if (val && typeof val === 'object') {
        const nestedInsight = val.insight || val.description || val.summary || val.text || JSON.stringify(val);
        return { topic: String(topic), insight: String(nestedInsight) };
      }
      return { topic: String(topic), insight: String(val || '') };
    });
  }

  return [];
}

/**
 * Get total number of customer questions asked to a business
 */
export async function getTotalQuestions(businessId) {
  const data = await request(`/api/v1/feature/questions/${businessId}`);
  return typeof data?.message === 'number' ? data.message : Number(data?.message || 0);
}

/**
 * Run topic clustering and strategic AI insights analysis on a range of customer questions.
 * Returns a normalized array of topic items: [{ topic: string, insight: string }]
 * @param {string} businessId
 * @param {number} start (1-indexed)
 * @param {number} end (1-indexed, max 100 questions range)
 */
export async function analyzeQuestionClusters(businessId, start = 1, end = 25) {
  const data = await request(`/api/v1/feature/cluster/${businessId}?start=${start}&end=${end}`, {
    method: 'POST',
  });
  const raw = data?.message !== undefined ? data.message : data;
  return normalizeClusterInsights(raw);
}

