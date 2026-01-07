import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateWebpayTransactionDto {
    @IsNotEmpty({ message: 'El ID de la orden es requerido' })
    @IsNumber({}, { message: 'El ID de la orden debe ser un número' })
    orderId: number;
}