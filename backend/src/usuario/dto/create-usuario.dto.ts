import { IsString, IsNotEmpty, IsInt, IsOptional, IsBoolean, MinLength, Matches, IsEmail } from 'class-validator';

export class CreateUsuarioDto {

    @IsEmail()
    @IsNotEmpty()
    userName: string;
    
    @IsString()
    @IsNotEmpty()
    nome: string;
    
    @IsString()
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