export class ErrorResponse extends Error {
  public readonly statusCode: number;
  public readonly timestamp: Date;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.timestamp = new Date();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorResponse);
    }

    this.name = this.constructor.name;
  }

  toJSON() {
    return {
      success: false,
      error: this.message,
      statusCode: this.statusCode,
      timestamp: this.timestamp.toISOString()
    };
  }

  toResponse(headers: Record<string, string> = {}): Response {
    const responseBody = JSON.stringify(this.toJSON());

    return new Response(responseBody, {
      status: this.statusCode,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    });
  }

  static badRequest(message: string = 'Bad Request'): ErrorResponse {
    return new ErrorResponse(message, 400);
  }

  static unauthorized(message: string = 'Unauthorized'): ErrorResponse {
    return new ErrorResponse(message, 401);
  }

  static forbidden(message: string = 'Forbidden'): ErrorResponse {
    return new ErrorResponse(message, 403);
  }

  static notFound(message: string = 'Not Found'): ErrorResponse {
    return new ErrorResponse(message, 404);
  }

  static internalError(message: string = 'Internal Server Error'): ErrorResponse {
    return new ErrorResponse(message, 500);
  }

  static fromError(error: unknown, statusCode: number = 500): ErrorResponse {
    const message = error instanceof Error ? error.message : String(error)
    return new ErrorResponse(message, statusCode);
  }
}

export function errorHandler(error: unknown): Response {
  if (error instanceof ErrorResponse) {
    return error.toResponse();
  }

  return ErrorResponse.fromError(error).toResponse();
}
