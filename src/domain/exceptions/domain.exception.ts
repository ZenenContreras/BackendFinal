export class DomainException extends Error {
    constructor(
        message: string,
        public readonly code: string,
    ) {
        super(message);
        this.name = 'DomainException';
    }
}

export class UserNotFoundException extends DomainException {
    constructor(id: string) {
        super(`El usuario con el "${id}" no se encuenta`, 'USUARIO_NO_ENCONTRADO');
    }
}

export class EmailAlreadyExistsException extends DomainException {
    constructor(email: string) {
        super(`El Email "${email}" ya está registrado`, 'EL_EMAIL_YA_EXISTE');
    }
}

export class UnauthorizedException extends DomainException {
    constructor() {
        super('No tienes permiso para realizar esta acción', 'NO_AUTORIZADO');
    }
}
