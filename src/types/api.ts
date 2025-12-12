export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode: number;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  statusCode: number;
  timestamp: string;
}
