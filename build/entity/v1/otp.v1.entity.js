"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpV1 = void 0;
const base_entity_1 = __importDefault(require("../base.entity"));
const otp_model_1 = __importDefault(require("@models/otp.model"));
const _services_1 = require("@services");
const _common_1 = require("@common");
class OtpEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async saveOtp(payload) {
        try {
            return await Promise.all([
                otp_model_1.default.findOneAndUpdate({ countryCode: payload.countryCode, phoneNo: payload.phoneNo }, payload, { upsert: true }),
                _services_1.redisDOA.insertKeyInRedis(`${payload.countryCode}-${payload.phoneNo}-${payload.type}`, payload.otp),
                _services_1.redisDOA.expireKey(`${payload.countryCode}-${payload.phoneNo}-${payload.type}`, _common_1.DATABASE.REDIS.OTP_EXPIRED_TIME)
            ]);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    ;
    async saveOtpFinalCount(payload) {
        try {
            return await Promise.all([
                otp_model_1.default.findOneAndUpdate({ countryCode: payload.countryCode, phoneNo: payload.phoneNo }, payload, { upsert: true }),
                _services_1.redisDOA.insertKeyInRedis(`${payload.countryCode}-${payload.phoneNo}-${payload.type}`, payload.otp),
                _services_1.redisDOA.expireKey(`${payload.countryCode}-${payload.phoneNo}-${payload.type}`, 300)
            ]);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    ;
    async getUserOtpFromDb(payload) {
        try {
            let getOtpFromRedis = await _services_1.redisDOA.getFromKey(`${payload.countryCode}-${payload.phoneNo}-${payload.type}`);
            return getOtpFromRedis;
        }
        catch (error) {
            let getOtpFromMongo = await otp_model_1.default.findOne({ countryCode: payload.countryCode, phoneNo: payload.phoneNo, type: payload.type }, { otp: 1 });
            if (getOtpFromMongo && getOtpFromMongo.otp)
                return getOtpFromMongo.otp;
            else
                return Promise.reject(error);
        }
    }
}
exports.OtpV1 = new OtpEntity(otp_model_1.default);
//# sourceMappingURL=otp.v1.entity.js.map