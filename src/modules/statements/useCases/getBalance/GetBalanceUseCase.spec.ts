import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "../../../users/useCases/authenticateUser/IncorrectEmailOrPasswordError";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";



let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

let statementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}


describe("Get Balance Test", () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);

    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository);
  });

  it("Should be able to list all Deposit and Withdraw operations of a valid user", async () => {
    const { id } = await createUserUseCase.execute({
      name: "Lucas Rios",
      email: "lucashrios95@gmail.com",
      password: "1234",
    });

    await authenticateUserUseCase.execute({
      email: "lucashrios95@gmail.com",
      password: "1234",
    });

    if (!id) {
      throw new CreateStatementError.UserNotFound;
    }

    await createStatementUseCase.execute({
      user_id: id,
      type: OperationType.DEPOSIT,
      amount: 500.00,
      description: "Deposit test",
    })

    await createStatementUseCase.execute({
      user_id: id,
      type: OperationType.WITHDRAW,
      amount: 115.00,
      description: "Withdraw Test",
    });

    const balance = await getBalanceUseCase.execute({
      user_id: id,
    });

    expect(balance).toHaveProperty("balance");
  });

  it("Shouldn't be able to list all Deposit and Withdraw operations from an invalid user", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "Lucas Rios",
        email: "lucashrios95@gmail.com",
        password: "1234",
      });

      await authenticateUserUseCase.execute({
        email: "lucashrios@gmail.com",
        password: "1234500",
      });

      await createStatementUseCase.execute({
        user_id: `${user.id}`,
        type: OperationType.DEPOSIT,
        amount: 800.00,
        description: "Deposit Test",
      });

      await createStatementUseCase.execute({
        user_id: `${user.id}`,
        type: OperationType.WITHDRAW,
        amount: 500.00,
        description: "Deposit Test",
      });

      await getBalanceUseCase.execute({
        user_id: `${user.id}`,
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

})
