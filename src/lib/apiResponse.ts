import { NextResponse } from 'next/server';

export type ApiErrorCode =
  | 'INVALID_REQUEST'
  | 'SERVICE_UNAVAILABLE'
  | 'UPLOAD_FAILED'
  | 'PDF_FAILED'
  | 'DB_ERROR'
  | 'EMAIL_FAILED'
  | 'NOT_FOUND'
  | 'INTERNAL';

export interface ApiError {
  error: true;
  code: ApiErrorCode;
  message: string;
}

export interface ApiSuccess<T = Record<string, unknown>> {
  error: false;
  data: T;
}

export type ApiResponse<T> = ApiError | ApiSuccess<T>;

export function apiError(
  code: ApiErrorCode,
  message: string,
  status: number
): NextResponse<ApiError> {
  return NextResponse.json({ error: true, code, message }, { status });
}

export function apiSuccess<T>(data: T): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ error: false, data });
}

/**
 * Client-side helper — call this after every fetch() to the API.
 *
 * Usage:
 *   const json = await res.json();
 *   const data = unwrapApi<{ downloadUrl: string }>(res, json);
 *   // throws a typed Error on failure, so callers just use try/catch
 *
 * Why: eliminates duplicated (!res.ok || json.error || json.data) checks
 * scattered across every form component.
 */
export async function unwrapApi<T>(
  res: Response,
  // Optional: if JSON already parsed, pass it. Otherwise, unwrapApi will parse.
  json?: ApiResponse<T> | unknown
): Promise<T> {
  let parsedJson: ApiResponse<T> | unknown;

  if (json) {
    parsedJson = json;
  } else {
    // Attempt to parse JSON, or fall back to text
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        parsedJson = await res.json();
      } catch (e) {
        // JSON parsing failed, likely malformed JSON or empty body
        const text = await res.text();
        console.error('API Response JSON parse error:', e, 'Response text:', text);
        throw new Error(
          `API Error: Invalid JSON response. Status: ${res.status}. Body: ${text.substring(0, 100)}`
        );
      }
    } else {
      const text = await res.text();
      console.warn('API Response not JSON. Status:', res.status, 'Response text:', text);
      throw new Error(
        `API Error: Unexpected response type. Status: ${res.status}. Body: ${text.substring(0, 100)}`
      );
    }
  }

  // Now process the parsed (or provided) JSON
  if (!res.ok && !isApiError(parsedJson)) {
    // This covers HTTP errors where the body wasn't our structured error.
    // This might be a 500 HTML page from Next.js or a proxy.
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  if (isApiError(parsedJson)) {
    throw new Error(parsedJson.message);
  }

  if (isApiSuccess<T>(parsedJson)) {
    return parsedJson.data;
  }

  throw new Error('Unexpected API response format.');
}

// ---------------------------------------------------------------------------
// Type guards
// ---------------------------------------------------------------------------

function isApiResponse(v: unknown): v is ApiResponse<unknown> {
  return typeof v === 'object' && v !== null && 'error' in v;
}

function isApiError(v: unknown): v is ApiError {
  return isApiResponse(v) && v.error === true && 'code' in v;
}

function isApiSuccess<T>(v: unknown): v is ApiSuccess<T> {
  return isApiResponse(v) && v.error === false && 'data' in v;
}
