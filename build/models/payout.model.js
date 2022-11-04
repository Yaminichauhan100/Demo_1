"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const _common_1 = require("@common");
const PayoutSchema = new mongoose_1.Schema({
    adminCommissionAmount: { type: mongoose_1.Schema.Types.Number },
    hostAmount: { type: mongoose_1.Schema.Types.Number },
    status: { type: mongoose_1.Schema.Types.Number, enum: _common_1.ENUM_ARRAY.PAYOUT.STATUS, default: _common_1.ENUM.PAYOUT.STATUS.PENDING },
    hostId: { type: mongoose_1.Schema.Types.ObjectId },
    bookingId: [{ type: mongoose_1.Schema.Types.ObjectId }],
    payoutId: { type: mongoose_1.Schema.Types.String }
}, {
    versionKey: false,
    collection: _common_1.ENUM.COL.PAYOUT,
    timestamps: true
});
exports.default = mongoose_1.model(_common_1.ENUM.COL.PAYOUT, PayoutSchema);
//# sourceMappingURL=payout.model.js.map