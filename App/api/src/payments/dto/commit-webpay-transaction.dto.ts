import { IsNotEmpty, IsString } from 'class-validator';

export class CommitWebpayTransactionDto {
    @IsNotEmpty({ message: 'El token de Webpay es requerido' })
    @IsString({ message: 'El token debe ser una cadena de texto' })
    token_ws: string;
}