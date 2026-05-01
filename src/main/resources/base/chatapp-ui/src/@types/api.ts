export interface APIResponse<T = null> {
  status_code: number;
  data: T;
  error_msg: string;
}

export interface APIError<T = null> {
  error_msg?: string;
  detail?: string;
  message?: string;
  data?: T;
}

export interface SessionExpiredResponse {
  detail: string;
}