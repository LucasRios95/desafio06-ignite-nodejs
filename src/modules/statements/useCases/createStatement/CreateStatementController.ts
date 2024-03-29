import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStatementUseCase } from './CreateStatementUseCase';


enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const sender_id  = request.params;
    const { amount, description } = request.body;

    const splittedPath = request.originalUrl.split('/');
    const type = splittedPath[4] as OperationType

    // const sender_id = splittedPath[5];

    const createStatement = container.resolve(CreateStatementUseCase);

    const statement = await createStatement.execute({
      user_id,
      sender_id: `${sender_id.user_id}`,
      type,
      amount,
      description
    });

    return response.status(201).json(statement);
  }
}
