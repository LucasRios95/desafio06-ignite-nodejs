import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

let statementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

const user: ICreateUserDTO = {
  name: "Lucas Rios",
  email: "lucashrios95@gmail.com",
  password: "1234",
}

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
};

describe("Get Statement Operation", () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);

    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository);
  });

  it("should be able to get a deposit operation from statement", async () => {
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

    const operation = await getStatementOperationUseCase.execute({
      user_id: `${loggedUser.id}`,
      statement_id: `${statement.id}`,
    });

    console.log(operation);

    expect(operation).toHaveProperty("id");
  });

  it("should be able to get a deposit operation from statement", async () => {
    const loggedUser = await createUserUseCase.execute(user);

    await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    await createStatementUseCase.execute({
      user_id: `${loggedUser.id}`,
      type: OperationType.DEPOSIT,
      amount: 10000.00,
      description: "Primeiro depósito"
    });

    const statement = await createStatementUseCase.execute({
      user_id: `${loggedUser.id}`,
      type: OperationType.WITHDRAW,
      amount: 5000.00,
      description: "Primeiro Saque"
    });

    const operation = await getStatementOperationUseCase.execute({
      user_id: `${loggedUser.id}`,
      statement_id: `${statement.id}`,
    });

    console.log(operation);

    expect(operation).toHaveProperty("id");
  });
})
