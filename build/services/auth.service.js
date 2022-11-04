"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const common_1 = require("../common");
exports.Auth = {
    generateToken: function (payload) {
        return jsonwebtoken_1.default.sign(payload, common_1.CONFIG.JWT_PASSWORD, { algorithm: 'HS256' });
    },
    verifyToken(token) {
        let payload = jsonwebtoken_1.default.verify(token, common_1.CONFIG.JWT_PASSWORD, { algorithms: ['HS256'] });
        if (payload) {
            return { success: true, data: payload };
        }
        else
            return { success: false };
    },
    generateAdminJWT: function (sessionId) {
        return jsonwebtoken_1.default.sign({
            sessionId: sessionId,
            timestamp: Date.now()
        }, common_1.CONFIG.JWT_PASSWORD, { algorithm: 'HS256' });
    },
    generateUserJWT: function (sessionId) {
        return jsonwebtoken_1.default.sign({
            sessionId: sessionId,
            timestamp: Date.now()
        }, common_1.CONFIG.JWT_PASSWORD, { algorithm: 'HS256' });
    },
    hashData: function (data, salt) {
        return crypto_1.default.createHmac('sha256', salt).update(data).digest('hex');
    }
};
//# sourceMappingURL=auth.service.js.map