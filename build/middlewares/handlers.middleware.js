"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidRoute = exports.ErrorHandler = void 0;
exports.ErrorHandler = function (err, req, res, next) {
    console.log(`Error handler error ==>`, err.name || err.joi.name, err);
    switch (err.name || err.joi.name) {
        case 'ValidationError':
            let messagetosend = err.joi.details[0].message.replace(/"/g, '');
            messagetosend = messagetosend[0].toUpperCase() + messagetosend.slice(1);
            return res.status(400).send({
                success: false,
                statusCode: 400,
                key: err.joi.details[0].context.key,
                message: messagetosend
            });
        case err.expose:
            console.log(`error.expose case`, err);
            return res.status(err.status).json({
                success: false,
                message: err.message,
                statusCode: err.statusCode
            });
        case "BadRequestError":
            console.log(`BadRequestError case ==>`, err);
            return res.status(err.status).json({
                success: false,
                message: err.message,
                statusCode: err.statusCode
            });
        case "JsonWebTokenError":
            console.log(`JsonWebTokenError case error ==>`, err);
            return res.status(err.status).json({
                success: false,
                message: err.message,
                statusCode: err.statusCode
            });
        default:
            console.log(`default case error ==>`, err);
            return res.status(err.status ? err.status : 500).json({
                success: false,
                statusCode: err.status ? err.status : 500,
                message: err.message ? err.message : 'Internal Server Error'
            });
    }
};
exports.InvalidRoute = (req, res, next) => {
    console.log("invalid route", req.url);
    res.status(404).json({
        success: false,
        message: 'Invalid route',
        statusCode: 404
    });
};
//# sourceMappingURL=handlers.middleware.js.map