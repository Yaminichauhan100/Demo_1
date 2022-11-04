"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const PaymentSchema = new mongoose_1.Schema({
    stripeTransactionId: { type: mongoose_1.SchemaTypes.String, trim: true },
    propertyName: { type: mongoose_1.SchemaTypes.String, trim: true },
    items: { type: mongoose_1.Schema.Types.String, trim: true },
    unit: { type: mongoose_1.SchemaTypes.Number },
    paymentMethod: { type: mongoose_1.SchemaTypes.String, trim: true, default: 'card' },
    price: { type: mongoose_1.SchemaTypes.Number },
    status: { type: mongoose_1.SchemaTypes.Number, default: common_1.ENUM.PAYMENT.STATUS.SUCCESS },
    fromDate: { type: mongoose_1.Schema.Types.Date, required: false },
    toDate: { type: mongoose_1.Schema.Types.Date, required: false },
    paymentPlan: { type: mongoose_1.Schema.Types.Number, enum: common_1.ENUM_ARRAY.PAYMENT.PLAN },
    last4: { type: mongoose_1.SchemaTypes.String, trim: true },
    userData: {
        name: { type: mongoose_1.SchemaTypes.String, trim: true },
        images: { type: mongoose_1.SchemaTypes.String, trim: true },
    },
    bookingId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    propertyId: { type: mongoose_1.Schema.Types.ObjectId, required: false },
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: false },
    transactionId: { type: mongoose_1.Schema.Types.String },
    userType: { type: mongoose_1.Schema.Types.Number, enum: common_1.ENUM_ARRAY.USER.TYPE },
    payoutStatus: { type: mongoose_1.Schema.Types.Boolean, default: false },
    payoutStripeId: { type: mongoose_1.Schema.Types.String },
    hostId: { type: mongoose_1.Schema.Types.ObjectId, required: false },
    adminCommissionAmount: { type: mongoose_1.Schema.Types.Number, default: 10 },
    payoutPrice: { type: mongoose_1.Schema.Types.Number, default: 0 }
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.Payment,
    timestamps: true
});
exports.default = mongoose_1.model(common_1.ENUM.COL.Payment, PaymentSchema);
//# sourceMappingURL=payment.model.js.map