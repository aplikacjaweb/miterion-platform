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
export function unwrapApi<T>(
  res: Response,
  json: ApiResponse<T> | unknown
): T {
  // Transport-level failure (network, 5xx before our handler ran)
  if (!res.ok && !isApiResponse(json)) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  // Our structured error shape
  if (isApiError(json)) {
    throw new Error(json.message);
  }

  // Our structured success shape
  if (isApiSuccess<T>(json)) {
    return json.data;
  }

  // fetch-trials returns FetchTrialsResponse directly (domain-level error field,
  // not the transport wrapper) — callers that need it handle it themselves.
  // This branch should not be reached for wrapped routes.
  throw new Error('Unexpected response shape from API');
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
