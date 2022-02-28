import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  });

  it("should be able to list all transactions and total balance", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "john@user.com",
      password: "12345"
    });

    const balance = await getBalanceUseCase.execute({user_id: user.id!});

    expect(balance).toHaveProperty("balance");
  });

  it("should not be able to get balance to a non-existent user", async () => {
    expect(async () => {
      const balance = await getBalanceUseCase.execute({user_id: "fake-id"});
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
