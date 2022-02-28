import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "./CreateStatementController";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("should be able to do a deposit transaction", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "john@user.com",
      password: "12345"
    });

    const deposit = await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 10,
      description: "Description Test"
    });

    expect(deposit).toHaveProperty("id");
    expect(deposit.amount).toEqual(10);
    expect(deposit.user_id).toEqual(user.id);
    expect(deposit.type).toEqual(OperationType.DEPOSIT);
  });

  it("should not be able to create a statement to a non-existent user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "fake-id",
        type: OperationType.DEPOSIT,
        amount: 10,
        description: "Description Test"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should be able to do a withdraw transaction", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "john@user.com",
      password: "12345"
    });

    await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 10,
      description: "Description Deposit"
    });

    const withdraw = await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.WITHDRAW,
      amount: 8,
      description: "Description Withdraw"
    });

    expect(withdraw).toHaveProperty("id");
    expect(withdraw.amount).toEqual(8);
    expect(withdraw.user_id).toEqual(user.id);
    expect(withdraw.type).toEqual(OperationType.WITHDRAW);
  });

  it("should not be able to do a withdraw if amount greater than current balance", async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: "John Doe",
        email: "john@user.com",
        password: "12345"
      });

      const deposit = await createStatementUseCase.execute({
        user_id: user.id!,
        type: OperationType.WITHDRAW,
        amount: 10,
        description: "Description Test"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
