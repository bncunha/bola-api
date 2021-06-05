import { IsNotEmpty } from "class-validator";

export class CreatePalpiteBonusDto {
  @IsNotEmpty({message: 'Campeão é obrigatório'})
  idCampeao: number;

  @IsNotEmpty({message: 'Vice-campeão é obrigatório'})
  idViceCampeao: number;
}
