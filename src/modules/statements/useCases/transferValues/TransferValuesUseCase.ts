import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import ITransferValueDTO from "./ITransferValueDTO";
import { TransferValuesError } from "./TransferValuesError";

class TransferValuesUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({senderId, receiverId, amount, description}: ITransferValueDTO): Promise<ITransferValueDTO> {
    const senderUser = await this.usersRepository.findById(senderId);

    if (!senderUser) {
      throw new TransferValuesError.SenderNotFound();
    }

    const receiverUser = await this.usersRepository.findById(receiverId);

    if (!receiverUser) {
      throw new TransferValuesError.ReceiverNotFound();
    }

    const senderUserBalance = await this.statementsRepository.getUserBalance({user_id: senderId});

    if (senderUserBalance.balance < amount) {
      throw new TransferValuesError.InsufficientFunds();
    }

    await this.statementsRepository.create({
      user_id: senderId,
      type: OperationType.WITHDRAW,
      amount,
      description,
    });

    const depositStatement = await this.statementsRepository.create({
      user_id: receiverId,
      type: OperationType.TRANSFER,
      amount,
      description,
    });

    const transferStatement: ITransferValueDTO = {
      id: depositStatement.id,
      receiverId,
      senderId,
      amount,
      description,
      type: depositStatement.type,
      created_at: depositStatement.created_at,
      update_at: depositStatement.updated_at,
    }

    return transferStatement;
  }
}

export default TransferValuesUseCase;
