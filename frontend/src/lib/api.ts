// Frontend API Client with tenant scoping, retry with exponential backoff, and timeout resilience

const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_BASE_URL = rawBase.replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '') + '/api/v1';

export interface AuthSession {
  token?: string;
  user?: {
    id: string;
    email: string;
    accountType: string;
    profile?: any;
    school?: {
      id: string;
      name: string;
      schoolCode: string;
    };
    membership?: {
      profile: string;
      permissions: any;
    };
  };
}

export const getStoredSession = (): AuthSession | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('sms_session');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const setStoredSession = (session: AuthSession) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sms_session', JSON.stringify(session));
  }
};

export const clearStoredSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('sms_session');
  }
};

export interface ApiRequestOptions extends RequestInit {
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Common fetcher with tenant headers, timeout, retry with exponential backoff
export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    timeoutMs = 12000,
    retries = (options.method && options.method.toUpperCase() !== 'GET') ? 0 : 2,
    retryDelayMs = 500,
    headers: customHeaders,
    ...restOptions
  } = options;

  const session = getStoredSession();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  if (session?.token) {
    headers['Authorization'] = `Bearer ${session.token}`;
  }

  if (session?.user?.school?.id) {
    headers['x-school-id'] = session.user.school.id;
    headers['x-school-code'] = session.user.school.schoolCode;
  }

  let attempt = 0;
  let lastError: any = null;

  while (attempt <= retries) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...restOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const message = errorData.message || errorData.error || `Request failed with status ${res.status}`;
        // Only retry 5xx server errors on idempotent methods
        if (res.status >= 500 && attempt < retries) {
          attempt++;
          await sleep(retryDelayMs * Math.pow(2, attempt - 1));
          continue;
        }
        throw new Error(Array.isArray(message) ? message.join(', ') : message);
      }

      const json = await res.json();
      // Handle standard { success: true, data: T } envelope from backend TransformInterceptor
      if (json && typeof json === 'object' && json.success === true && 'data' in json) {
        return json.data;
      }
      return json;
    } catch (err: any) {
      clearTimeout(timer);
      lastError = err;

      if (err.name === 'AbortError') {
        lastError = new Error(`Request to ${endpoint} timed out after ${timeoutMs}ms`);
      }

      // Retry network or abort errors if retries remain
      if (attempt < retries) {
        attempt++;
        await sleep(retryDelayMs * Math.pow(2, attempt - 1));
        continue;
      }

      console.warn(`API call to ${endpoint} encountered:`, lastError.message);
      throw lastError;
    }
  }

  throw lastError;
}
