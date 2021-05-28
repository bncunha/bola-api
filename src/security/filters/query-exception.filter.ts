import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Catch(QueryFailedError, EntityNotFoundError)
export class QueryExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    console.log(exception);
    console.log('path', ctx.getRequest().path)
    response
      .status(400)
      .json({
        statusCode: 400,
        message: this.getMessage(exception.code),
      });
  }

  private getMessage(code: string) {
    switch(code) {
      case 'ER_DUP_ENTRY': return 'Dado já cadastrado!';
      default: return 'Erro ao realizar operação no banco de dados!';
    }
  }
}