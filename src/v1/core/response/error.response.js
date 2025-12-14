class ErrorResponse extends Error {
    constructor({
        message = "Error",
        statusCode = 500,
        reasonStatusCode,
        metadata = {}
    }) {
        super(message);

        this.statusCode = statusCode;
        this.reasonStatusCode = reasonStatusCode;
        this.metadata = metadata;

        Error.captureStackTrace(this, this.constructor);
    }

    send(res) {
        return res.status(this.statusCode).json({
            status: "error",
            message: this.message,
            errors: this.metadata
        });
    }
}

/**
 * 400 Bad Request
 */
class BadRequestError extends ErrorResponse {
    constructor({
        message = "Bad Request",
        metadata = {}
    }) {
        super({
            message,
            statusCode: 400,
            metadata
        });
    }
}

/**
 * 401 Unauthorized
 */
class UnauthorizedError extends ErrorResponse {
    constructor({
        message = "Unauthorized",
        metadata = {}
    }) {
        super({
            message,
            statusCode: 401,
            metadata
        });
    }
}

/**
 * 403 Forbidden
 */
class ForbiddenError extends ErrorResponse {
    constructor({
        message = "Forbidden",
        metadata = {}
    }) {
        super({
            message,
            statusCode: 403,
            metadata
        });
    }
}

/**
 * 404 Not Found
 */
class NotFoundError extends ErrorResponse {
    constructor({
        message = "Not Found",
        metadata = {}
    }) {
        super({
            message,
            statusCode: 404,
            metadata
        });
    }
}

/**
 * 409 Conflict
 */
class ConflictError extends ErrorResponse {
    constructor({
        message = "Conflict",
        metadata = {}
    }) {
        super({
            message,
            statusCode: 409,
            metadata
        });
    }
}

/**
 * 500 Internal Server Error
 */
class InternalServerError extends ErrorResponse {
    constructor({
        message = "Internal Server Error",
        metadata = {}
    }) {
        super({
            message,
            statusCode: 500,
            metadata
        });
    }
}

class ExistedError extends ErrorResponse {
    constructor({
        message = "Existed Error",
        metadata = {}
    }) {
        super({
            message,
            statusCode: 409,
            metadata
        });
    }
}

module.exports = {
    ErrorResponse,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    InternalServerError,
    ExistedError
};
