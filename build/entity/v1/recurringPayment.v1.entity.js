"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecurringPayV1 = void 0;
const base_entity_1 = __importDefault(require("../base.entity"));
const recurringPayments_model_1 = __importDefault(require("@models/recurringPayments.model"));
class RecurringPaymentEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
}
exports.RecurringPayV1 = new RecurringPaymentEntity(recurringPayments_model_1.default);
//# sourceMappingURL=recurringPayment.v1.entity.js.map