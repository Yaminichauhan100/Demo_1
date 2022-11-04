"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const recurringSchema = new mongoose_1.Schema({
    month: { type: mongoose_1.Schema.Types.Number },
    bookingId: { type: mongoose_1.Schema.Types.ObjectId },
    fromDate: { type: mongoose_1.Schema.Types.Date },
    toDate: { type: mongoose_1.Schema.Types.Date },
    paymentStatus: {
        type: mongoose_1.Schema.Types.Number,
        default: common_1.ENUM.PAYMENT.STATUS.PENDING
    },
    paymentPlan: {
        type: mongoose_1.Schema.Types.Number,
        enum: common_1.ENUM_ARRAY.PAYMENT.PLAN
    },
    monthlyPayable: { type: mongoose_1.Schema.Types.Number },
    bookingStatus: {
        type: mongoose_1.Schema.Types.Number,
        enum: common_1.ENUM_ARRAY.BOOKING.STATUS,
        default: common_1.ENUM.BOOKING.STATUS.ABANDONED
    },
    paymentDate: { type: mongoose_1.Schema.Types.Date }
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.RECURRING_PAYMENTS,
    timestamps: true
});
exports.default = mongoose_1.model(common_1.ENUM.COL.RECURRING_PAYMENTS, recurringSchema);
//# sourceMappingURL=recurringPayments.model.js.map