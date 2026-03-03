import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class PrismaExceptions implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errMap = {
      P2025: {
        status: HttpStatus.NOT_FOUND,
        message: 'Record not found',
      },
      P2002: {
        status: HttpStatus.CONFLICT,
        message: 'Unique constraint violation',
      },
      P2003: {
        status: HttpStatus.CONFLICT,
        message: 'Foreign key constraint violation',
      },
      P2014: {
        status: HttpStatus.BAD_REQUEST,
        message: 'Required relation missing',
      },
    };

    const error: {
      status: number,
      message: string
    } = errMap[exception.code] || {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    };

    response.status(error.status).json({
      statusCode: error.status,
      message: error.message,
      error: exception.code,
      timestamp: new Date().toISOString(),
    });
  }
}
