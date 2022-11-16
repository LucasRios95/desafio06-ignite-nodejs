import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";
import { AppError } from "../../../../shared/errors/AppError";

let usersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("Should be able to authenticate a valid user", async () => {
    const user: ICreateUserDTO = {
      email: "lucashrios@gmail.com",
      name: "Lucas Rios",
      password: "12345",
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: "lucashrios@gmail.com",
      password: "12345"
    })

    expect(result).toHaveProperty("token");
  });

  it("Should not be able to authenticate a non existent user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "falsemail@gmail.com",
        password: "0983",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate with an incorrect e-mail", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: "lucashrios95@gmail.com",
        name: "Lucas Rios",
        password: "12345",
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: "lucashrios@gmail.com",
        password: user.password
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate with an incorrect password", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: "lucashrios95@gmail.com",
        name: "Lucas Rios",
        password: "12345",
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "1234"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
