"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyV1 = void 0;
const mongoose_1 = require("mongoose");
const base_entity_1 = __importDefault(require("../base.entity"));
const user_company_details_model_1 = __importDefault(require("@models/user.company_details.model"));
const host_v1_entity_1 = require("./host.v1.entity");
const user_v1_entity_1 = require("./user.v1.entity");
class CompanyDetailEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async hostCompanyDetails(payload) {
        let promise = [];
        promise.push(new this.model(payload).save());
        promise.push(host_v1_entity_1.HostV1.updateDocument({ _id: payload.userId }, { profileCompleted: true }));
        let promiseData = await Promise.all(promise);
        return promiseData[0].toObject();
    }
    async userCompanyDetails(payload) {
        let promise = [];
        promise.push(new this.model(payload).save());
        promise.push(user_v1_entity_1.UserV1.updateDocument({ _id: payload.userId }, { profileCompleted: true }));
        let promiseData = await Promise.all(promise);
        return promiseData[0].toObject();
    }
    filterCompanyData(userData) {
        return userData;
    }
    async updateProperty(payload, id) {
        this.updateDocument({ '_id': mongoose_1.Types.ObjectId(id) }, payload);
    }
    async verifyUserPhone(userId) {
        let update = {
            phoneVerified: true,
            otp: null
        };
        return await this.updateDocument({ _id: userId }, update);
    }
    removeUnnecessaryData(data) {
        delete (data.password);
        delete (data.otp);
        delete (data.otpExpiry);
        delete (data.resetToken);
        return data;
    }
}
exports.CompanyV1 = new CompanyDetailEntity(user_company_details_model_1.default);
//# sourceMappingURL=company.details.entity.js.map