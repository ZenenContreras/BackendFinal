import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'El email debe ser válido' })
    email!: string;

    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener mínimo 6 caracteres' })
    password!: string;
}