import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { UsersRepository } from "../../repositories/UsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileController } from "./ShowUserProfileController";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase
let showUserProfileUseCase: ShowUserProfileUseCase

describe("Show User Profile Test", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it("Should be able to show an user profile", async () => {

    const user = await createUserUseCase.execute({
      email: "lucashrios@gmail.com",
      name: "Lucas Rios",
      password: "12345",
    });

    console.log(user);

    await authenticateUserUseCase.execute({
      email: "lucashrios@gmail.com",
      password: "12345"
    });

    const userProfile = await showUserProfileUseCase.execute(`${user.id}`);

    console.log(userProfile);


    expect(userProfile).toHaveProperty("name");
    expect(userProfile).toHaveProperty("email");
    expect(userProfile).toHaveProperty("password");
  })
});
