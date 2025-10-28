import { IsString, IsNotEmpty, IsOptional, MinLength, Matches, IsEmail } from 'class-validator';

export class CreateUsuarioDto {

    @IsString()
    @IsNotEmpty()
    userName: string;
    
    @IsString()
    @IsNotEmpty()
    nome: string;
    
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    senha: string;

    @IsString()
    @IsNotEmpty()
    confirmarSenha: string;
    
    @IsString()
    @IsOptional()
    fotoPerfil?: string;
}