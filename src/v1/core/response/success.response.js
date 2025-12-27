class SuccessResponse {
    constructor({
        message = "Success",
        statusCode = 200,
        metadata = {}
    }) {
        this.message = message;
        this.statusCode = statusCode;
        this.metadata = metadata;
    }

    send(res) {
        return res.status(this.statusCode).json({
            status: "success",
            message: this.message,
            data: this.metadata
        });
    }
}

class OK extends SuccessResponse {
    constructor({ message = "OK", metadata = {} }) {
        super({
            message,
            statusCode: 200,
            metadata
        });
    }
}

class CREATED extends SuccessResponse {
    constructor({ message = "Created", metadata = {} }) {
        super({
            message,
            statusCode: 201,
            metadata
        });
    }
}

module.exports = {
    OK,
    CREATED
};
