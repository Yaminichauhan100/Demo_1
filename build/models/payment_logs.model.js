"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const PaymentLogSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.SchemaTypes.String, trim: true },
    data: { type: Object },
    status: {
        type: Number,
        default: common_1.ENUM.PAYMENT.STATUS.SUCCESS
    }
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.PaymentLogs,
    timestamps: true
});
exports.default = mongoose_1.model(common_1.ENUM.COL.PaymentLogs, PaymentLogSchema);
//# sourceMappingURL=payment_logs.model.js.map