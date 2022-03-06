import { OperationType } from "../../entities/Statement";

interface ITransferValueDTO {
  id?: string;
  senderId: string;
  receiverId: string;
  amount: number;
  description: string;
  type?: OperationType;
  created_at?: Date;
  update_at?: Date;
}

export default ITransferValueDTO;
