"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const GiftCardSchema = new mongoose_1.Schema({
    to: { type: mongoose_1.SchemaTypes.String, trim: true, lowercase: true },
    from: { type: mongoose_1.SchemaTypes.String, trim: true },
    redemptionStatus: {
        type: mongoose_1.SchemaTypes.Number,
        enum: common_1.ENUM_ARRAY.USER.GIFT_CARD_REDEMPTION,
        default: common_1.ENUM.GIFT_CARD.REDEMPTION_STATUS.NOT_REDEEMED
    },
    bookingId: [{ type: mongoose_1.Schema.Types.ObjectId }],
    amount: { type: mongoose_1.SchemaTypes.Number },
    originalAmount: { type: mongoose_1.SchemaTypes.Number },
    message: { type: mongoose_1.SchemaTypes.String, trim: true },
    transactionDetails: {
        transactionId: { type: mongoose_1.Schema.Types.String },
        stripeTransactionId: { type: mongoose_1.SchemaTypes.String, trim: true },
        paymentMethod: { type: mongoose_1.SchemaTypes.String, trim: true },
        last4: { type: mongoose_1.SchemaTypes.String, trim: true },
    },
    userId: { type: mongoose_1.Schema.Types.ObjectId },
    giftCardNo: { type: mongoose_1.Schema.Types.String },
    giftCardPin: { type: mongoose_1.Schema.Types.Number },
    redemptionDate: [{ type: mongoose_1.Schema.Types.Date, required: false }],
    paymentStatus: { type: mongoose_1.SchemaTypes.Number, default: common_1.ENUM.PAYMENT.STATUS.PENDING },
    buyerId: { type: mongoose_1.Schema.Types.ObjectId },
    validity: { type: mongoose_1.Schema.Types.Date }
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.Giftcard,
    timestamps: true
});
exports.default = mongoose_1.model(common_1.ENUM.COL.Giftcard, GiftCardSchema);
//# sourceMappingURL=giftcard.model.js.map