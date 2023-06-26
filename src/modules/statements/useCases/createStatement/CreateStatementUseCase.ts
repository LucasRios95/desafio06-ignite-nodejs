import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { ICreateStatementDTO } from "./ICreateStatementDTO";
import { OperationType } from "../../entities/Statement";


@injectable()
export class CreateStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ user_id, sender_id, type, amount, description }: ICreateStatementDTO) {
    const sender = await this.usersRepository.findById(user_id);

    if(!sender) {
      throw new CreateStatementError.UserNotFound();
    }

    const receiver = await this.usersRepository.findById(sender_id)

    console.log(sender, receiver);

    if(!receiver) {
      throw new CreateStatementError.UserNotFound();
    }

    if(type !== 'deposit') {
      const { balance } = await this.statementsRepository.getUserBalance({ user_id });

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds()
      }
    }

      if(type === 'transfer') {
        await this.statementsRepository.create({
          user_id: sender.id as string,
          sender_id: sender.id as string,
          type: OperationType.WITHDRAW,
          amount,
          description: `Transferencia enviada - ${description}`,
        });

        const statementOperation = await this.statementsRepository.create({
          user_id: receiver.id as string,
          sender_id: sender.id as string,
          type: OperationType.TRANSFER,
          amount,
          description:`Transferencia recebida - ${description}`
        });

        return statementOperation;
      }

    const statementOperation = await this.statementsRepository.create({
      user_id,
      sender_id,
      type,
      amount,
      description,
    });

    return statementOperation;
  }
}
