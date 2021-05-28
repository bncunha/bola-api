import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const json = typeof exception.getResponse() === 'string' ? exception.getResponse() : {
      statusCode: status || 400,
      message: (exception.getResponse() as any).message || 'Erro interno no servidor!'
    }
    response
      .status(status || 400)
      .json(json);
  }
}