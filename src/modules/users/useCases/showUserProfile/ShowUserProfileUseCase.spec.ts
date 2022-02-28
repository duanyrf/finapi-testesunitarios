import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("should be able to show the user authenticated profile", async () => {
    const user = await createUserUseCase.execute({
      name: "John Doe",
      email: "john@user.com",
      password: "12345"
    });

    const profile = await showUserProfileUseCase.execute(user.id!);

    expect(profile.name).toEqual("John Doe");
    expect(profile.email).toEqual("john@user.com");
  });

  it("should not be able to show the profile for non-existent user", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("fake-id");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
