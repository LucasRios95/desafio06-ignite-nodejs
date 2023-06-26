import { Statement } from "../../entities/Statement";

export type ICreateStatementDTO =
Pick<
  Statement,
  'user_id' |
  'sender_id' |
  'type' |
  'amount' |
  'description'
>
