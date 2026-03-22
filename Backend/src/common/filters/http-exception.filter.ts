import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { TokenExpiredError } from '@nestjs/jwt';
import { Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    if (exception instanceof TokenExpiredError) {
      status = 400;
      message = exception.message;
    }

    const errorResponse = {
      statusCode: status,
      message,
      timestamps: new Date().toISOString(),
      path: ctx.getRequest().url,
      method: ctx.getRequest().method,
    };

    response.status(status).json(errorResponse);
  }
}
