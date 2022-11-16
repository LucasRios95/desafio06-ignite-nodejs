import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "../../../users/useCases/authenticateUser/IncorrectEmailOrPasswordError";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";


let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

let statementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;


const user: ICreateUserDTO = {
  name: "Lucas Rios",
  email: "lucashrios95@gmail.com",
  password: "1234",
}

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
};

describe("Create Statement Test", () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);

    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
  });

  it("Should be able to create a Statement with a deposit operation", async () => {
    const loggedUser = await createUserUseCase.execute(user);

    await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    const statement = await createStatementUseCase.execute({
      user_id: `${loggedUser.id}`,
      type: OperationType.DEPOSIT,
      amount: 10000.00,
      description: "Primeiro depósito"
    });

    console.log(statement);

    expect(statement).toHaveProperty("id");
  });

  it("Should be able to create a Statement with a deposit operation", async () => {
    const loggedUser = await createUserUseCase.execute(user);

    await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    const statement = await createStatementUseCase.execute({
      user_id: `${loggedUser.id}`,
      type: OperationType.DEPOSIT,
      amount: 10000.00,
      description: "Primeiro depósito"
    });

    console.log(statement);

    expect(statement).toHaveProperty("id");
  });


  it("Should be able to create a statement with a withdraw operation", async () => {
    const loggedUser = await createUserUseCase.execute(user);

    await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    await createStatementUseCase.execute({
      user_id: `${loggedUser.id}`,
      type: OperationType.DEPOSIT,
      amount: 10000.00,
      description: "Depósito em conta"
    });

    const statement = await createStatementUseCase.execute({
      user_id: `${loggedUser.id}`,
      type: OperationType.WITHDRAW,
      amount: 1000.00,
      description: "Primeiro Saque"
    });

    console.log(statement);

    expect(statement).toHaveProperty("id");
  });

  it("Should not be able to create a statement for an invalid user", async () => {
    expect(async () => {
      const loggedUser = await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: "lucashrios@outlook.com",
        password: user.password,
      });

      const statement = await createStatementUseCase.execute({
        user_id: "1234",
        type: OperationType.DEPOSIT,
        amount: 10000.00,
        description: "Primeiro depósito"
      });

      const statementWithdraw = await createStatementUseCase.execute({
        user_id: `${loggedUser.id}`,
        type: OperationType.WITHDRAW,
        amount: 1000,
        description: "Primeiro Saque"
      });

      console.log(statement, statementWithdraw);
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should not be able to make a Withdraw operation with an amount bigger than the balance", async () => {
    expect(async () => {
      const loggedUser = await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: user.password,
      });

      await createStatementUseCase.execute({
        user_id: `${loggedUser.id}`,
        type: OperationType.DEPOSIT,
        amount: 10000.00,
        description: "Depósito em conta"
      });

      const statement = await createStatementUseCase.execute({
        user_id: `${loggedUser.id}`,
        type: OperationType.WITHDRAW,
        amount: 25000.00,
        description: "Saque indevido"
      });

      console.log(statement);
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  })
});
