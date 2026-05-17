export class AuthError extends Error{
    public name
    public code

    constructor(message: string = "Invalid credentials"){
        super(message)
        this.name = 'AuthError'
        this.code = 401
        Error.captureStackTrace(this, this.constructor)
    }
    
}

export class NosyError extends Error{
    public name
    public code

    constructor(message: string = 'Stop being nosy'){
        super(message)
        this.name = 'NoseyError'
        this. code = 403
        Error.captureStackTrace(this, this.constructor)
    }
}

export class AttackError extends Error{
    public name
    public code

    constructor(message: string){
        super(message)
        this.name = 'NoseyError'
        this. code = 403
        Error.captureStackTrace(this, this.constructor)
    }
}
