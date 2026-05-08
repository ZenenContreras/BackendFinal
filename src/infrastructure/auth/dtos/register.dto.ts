import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
    @IsString()
    @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    @MaxLength(100, { message: 'El nombre tiene un máximo de 100 caracteres' })
    name!: string;

    @IsEmail({}, { message: 'El email debe ser válido' })
    email!: string;

    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener minimo 6 caracteres' })
    password!: string;
}