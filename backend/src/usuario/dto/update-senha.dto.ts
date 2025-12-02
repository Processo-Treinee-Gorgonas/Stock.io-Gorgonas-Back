import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class UpdateSenhaDto {
    @IsString()
    @IsNotEmpty()
    senhaAntiga: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    novaSenha: string;
}