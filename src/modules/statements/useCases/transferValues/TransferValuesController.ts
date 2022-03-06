import { Request, Response } from "express";
import { container } from "tsyringe";
import TransferValuesUseCase from "./TransferValuesUseCase";

class TransferValuesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { user_id: receiverId } = request.params;
    const { id: senderId } = request.user;
    const { amount, description } = request.body;

    const transferValuesUseCase = container.resolve(TransferValuesUseCase);

    const transferStatement = await transferValuesUseCase.execute({senderId, receiverId, amount, description});

    return response.status(201).json(transferStatement);
  }
}

export default TransferValuesController;
