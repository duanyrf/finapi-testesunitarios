import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@test.com",
      password: "12345"
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create another user with same email", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "John Doe",
        email: "john@user.com",
        password: "12345"
      });

      await createUserUseCase.execute({
        name: "User Test",
        email: "john@user.com",
        password: "ABCDE"
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
