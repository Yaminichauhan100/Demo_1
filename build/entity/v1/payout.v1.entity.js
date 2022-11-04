"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutV1 = void 0;
const mongoose_1 = require("mongoose");
const base_entity_1 = __importDefault(require("../base.entity"));
const payout_model_1 = __importDefault(require("@models/payout.model"));
class PayoutEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async insertPayoutData(data) {
        try {
            await exports.PayoutV1.findOne({ hostId: mongoose_1.Types.ObjectId(data.hostId) }, { adminCommissionAmount: 1, hostAmount: 1 });
        }
        catch (error) {
            console.error(`we have an error => ${error}`);
            throw error;
        }
    }
}
exports.PayoutV1 = new PayoutEntity(payout_model_1.default);
//# sourceMappingURL=payout.v1.entity.js.map