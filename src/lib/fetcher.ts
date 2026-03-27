// Generic SWR-compatible fetcher + typed request helpers

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/** SWR-compatible fetcher — pass to useSWR as the second argument */
export async function fetcher<T = unknown>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body?.error ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

/** Typed POST helper */
export async function post<TBody, TResponse = unknown>(
  url: string,
  body: TBody,
  headers?: HeadersInit,
): Promise<TResponse> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err?.error ?? res.statusText);
  }
  return res.json() as Promise<TResponse>;
}

/** Typed PATCH helper */
export async function patch<TBody, TResponse = unknown>(
  url: string,
  body: TBody,
): Promise<TResponse> {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err?.error ?? res.statusText);
  }
  return res.json() as Promise<TResponse>;
}

/** Typed DELETE helper */
export async function del<TResponse = unknown>(url: string): Promise<TResponse> {
  const res = await fetch(url, { method: 'DELETE', credentials: 'include' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err?.error ?? res.statusText);
  }
  return res.json() as Promise<TResponse>;
}
