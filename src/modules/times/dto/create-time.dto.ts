import { IsNotEmpty } from "class-validator";

export class CreateTimeDto {
  @IsNotEmpty()
  times: string[]
}
