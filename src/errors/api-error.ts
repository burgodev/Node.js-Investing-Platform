import { HttpStatusCode } from '../helpers/response';
import BaseError from "./base-error";

export default class APIError extends BaseError {

    constructor(message = 'internal server error', data: any = null, httpCode = HttpStatusCode.INTERNAL_SERVER, isOperational = true) {
        super(message, httpCode, isOperational, data);
    }
    
}