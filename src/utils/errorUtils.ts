export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown) => {
  console.error('Error:', error);
  if (error instanceof AppError) {
    return error.message;
  }
  return '予期せぬエラーが発生しました';
}; 