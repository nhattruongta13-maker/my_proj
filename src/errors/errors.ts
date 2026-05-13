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