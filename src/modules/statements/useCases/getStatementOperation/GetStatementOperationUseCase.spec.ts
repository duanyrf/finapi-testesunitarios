import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "../createStatement/CreateStatementController";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("should be able to get a specific statement", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "john@user.com",
      password: "12345"
    });

    const deposit = await inMemoryStatementsRepository.create({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 7.50,
      description: "Deposit 7.50"
    });

    const withdraw = await inMemoryStatementsRepository.create({
      user_id: user.id!,
      type: OperationType.WITHDRAW,
      amount: 3.45,
      description: "Withdraw 3.45"
    });

    const depositStatement = await getStatementOperationUseCase.execute({
      user_id: user.id!,
      statement_id: deposit.id!
    });

    const withdrawStatement = await getStatementOperationUseCase.execute({
      user_id: user.id!,
      statement_id: withdraw.id!
    });

    expect(depositStatement).toHaveProperty("id");
    expect(depositStatement.user_id).toEqual(user.id);
    expect(depositStatement.type).toEqual(OperationType.DEPOSIT);
    expect(depositStatement.amount).toEqual(7.50);

    expect(withdrawStatement).toHaveProperty("id");
    expect(withdrawStatement.user_id).toEqual(user.id)
    expect(withdrawStatement.type).toEqual(OperationType.WITHDRAW);
    expect(withdrawStatement.amount).toEqual(3.45);
  });

  it("should not be able to get statement to a non-existent user", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "john@user.com",
      password: "12345"
    });

    const deposit = await inMemoryStatementsRepository.create({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 7.50,
      description: "Deposit 7.50"
    });

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "fake-id",
        statement_id: deposit.id!
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get a non-existent statement", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "john@user.com",
      password: "12345"
    });

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: user.id!,
        statement_id: "fake-id"
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
