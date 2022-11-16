import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";


import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;

describe("Create User", () => {
    beforeEach(() => {
      usersRepository = new InMemoryUsersRepository();
      createUserUseCase = new CreateUserUseCase(usersRepository);
    });

    it("Should be able to create a new user", async () => {
      const user = await createUserUseCase.execute({
        name: "Lucas Rios",
        email: "lucashrios95@gmail.com",
        password: "1234"
      });

      expect(user).toHaveProperty("id");
    });

    it("Should not be able to create an user with an e-mail that already exists", async () => {
      expect(async () => {
        await createUserUseCase.execute({
          name: "Lucas Rios",
          email: "lucashrios95@gmail.com",
          password: "1234"
        });

        await createUserUseCase.execute({
          name: "Tomas Turbano",
          email: "lucashrios95@gmail.com",
          password: "4321"
        });
      }).rejects.toBeInstanceOf(CreateUserError);
    });
})
