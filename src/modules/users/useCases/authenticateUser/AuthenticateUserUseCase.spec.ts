import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate an user", async () => {
    const user = await createUserUseCase.execute({
      name: "John Doe",
      email: "john@user.com",
      password: "12345"
    });

    const authUser = await authenticateUserUseCase.execute({
      email: "john@user.com",
      password: "12345"
    });

    expect(authUser).toHaveProperty("token");
    expect(authUser.token.length).toBeGreaterThan(0);
  });

  it("should not be able to authenticate a non-existent user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "john@user.com",
        password: "12345"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate an user with wrong password", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "John Doe",
        email: "john@user.com",
        password: "12345"
      });

      await authenticateUserUseCase.execute({
        email: "john@user.com",
        password: "ABCD"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
