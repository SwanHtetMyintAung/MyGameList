import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResultKind } from '../../utils/Result'; // Adjust path to your Result.ts
import { ErrorCodes } from '../../utils/Errors'; // Adjust path to your Errors.ts

@Injectable()
export class ResultInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // 1. Check if the returned data is actually a 'Result' object
        // We check for 'kind' because that's how you defined Ok and Err
        if (data && typeof data === 'object' && 'kind' in data) {
          const response = context.switchToHttp().getResponse();

          // 2. Handle Success (Ok)
          if (data.kind === ResultKind.Ok) {
            return {
              success: true,
              data: data.value, // Extract the T value
            };
          }

          // 3. Handle Failure (Err)
          if (data.kind === ResultKind.Err) {
            const errorCode: ErrorCodes = data.error;

            // Set the actual HTTP Status Code on the response object
            // This prevents it from always being "200 OK"
            response.status(this.mapErrorCodeToStatus(errorCode));

            return {
              success: false,
              error: {
                code: errorCode,
                type: ErrorCodes[errorCode], // Converts enum number to string name (e.g., "DbKeyNotFound")
                message: this.getErrorMessage(errorCode),
              },
            };
          }
        }

        // If it's not a Result, just pass it through
        return data;
      }),
    );
  }

  private mapErrorCodeToStatus(code: ErrorCodes): number {
    switch (code) {
      case ErrorCodes.DbKeyNotFound:
      case ErrorCodes.DbValueNotFound:
        return HttpStatus.NOT_FOUND;
      case ErrorCodes.ValueConflict:
      case ErrorCodes.DbKeyAlreadyExists:
      case ErrorCodes.DbValueAlreadyExists:
        return HttpStatus.CONFLICT;
      case ErrorCodes.UserErr:
        return HttpStatus.BAD_REQUEST;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  private getErrorMessage(code: ErrorCodes): string {
    const messages: Record<number, string> = {
      [ErrorCodes.DbKeyNotFound]: 'The requested resource was not found.',
      [ErrorCodes.DbValueAlreadyExists]: 'This data already exists in our system.',
      [ErrorCodes.UserErr]: 'There was an error with the provided user data.',
    };
    return messages[code] || 'An unexpected internal error occurred.';
  }
}