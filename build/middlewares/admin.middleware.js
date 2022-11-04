"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyAdminSession = void 0;
const mongoose_1 = require("mongoose");
const services_1 = require("../services");
const admin_session_model_1 = __importDefault(require("@models/admin_session.model"));
exports.VerifyAdminSession = async function (req, res, next) {
    if (req.headers.authorization) {
        let authMethod = req.headers.authorization.split(" ")[0], authToken = req.headers.authorization.split(" ")[1];
        if (authMethod === 'Bearer' && authToken) {
            let decrypted = services_1.Auth.verifyToken(authToken);
            if (decrypted.success) {
                let sessionData = await admin_session_model_1.default.findOne({ _id: mongoose_1.Types.ObjectId(decrypted.data.sessionId) }).exec();
                if (sessionData && sessionData.isActive) {
                    res.locals.adminSessionId = sessionData._id;
                    res.locals.adminId = sessionData.adminId;
                    next();
                }
                else
                    res.status(401).send({ success: false, statusCode: 401, message: 'Invalid Session or Session expired' });
            }
            else
                res.status(401).send('Invalid authorization token');
        }
        else
            res.status(400).send('Invalid authorization method');
    }
    else
        res.status(400).send({ success: false, statusCode: 400, message: 'Authorization header missing' });
};
//# sourceMappingURL=admin.middleware.js.map