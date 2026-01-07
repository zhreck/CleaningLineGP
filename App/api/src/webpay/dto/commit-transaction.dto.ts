import { IsNotEmpty, IsString } from 'class-validator';

export class CommitTransactionDto {
    @IsNotEmpty()
    @IsString()
    token_ws: string;
}
