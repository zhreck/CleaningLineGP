import {
  IsOptional,
  IsString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsNotEmpty({ message: 'El ID del producto es requerido' })
  @IsNumber({}, { message: 'El ID del producto debe ser un número' })
  productId: number;

  @IsNotEmpty({ message: 'La cantidad es requerida' })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @IsPositive({ message: 'La cantidad debe ser positiva' })
  quantity: number;

  @IsNotEmpty({ message: 'El precio es requerido' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser positivo' })
  price: number;
}

export class CreateOrderDto {
  @IsNotEmpty({ message: 'El tipo de entrega es requerido' })
  @IsIn(['pickup', 'delivery'], {
    message: 'El tipo de entrega debe ser "pickup" o "delivery"',
  })
  deliveryType: 'pickup' | 'delivery';

  @IsOptional()
  @IsString()
  notes?: string;

  // Datos del cliente (requeridos para checkout invitado)
  @IsNotEmpty({ message: 'El nombre del cliente es requerido' })
  @IsString()
  customerName: string;

  @IsNotEmpty({ message: 'El email del cliente es requerido' })
  @IsEmail({}, { message: 'El email debe ser válido' })
  customerEmail: string;

  @IsNotEmpty({ message: 'El teléfono del cliente es requerido' })
  @IsString()
  customerPhone: string;

  @IsOptional()
  @IsString()
  customerRut?: string;

  @IsOptional()
  @IsString()
  customerAddress?: string;

  @IsOptional()
  @IsString()
  customerRegion?: string;

  @IsOptional()
  @IsString()
  customerCommune?: string;

  // Items para checkout invitado
  @IsOptional()
  @IsArray({ message: 'Los items deben ser un array' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items?: OrderItemDto[];
}
