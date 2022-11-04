"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const _common_1 = require("@common");
const promotionSchema = new mongoose_1.Schema({
    propertyId: {
        type: mongoose_1.Schema.Types.ObjectId
    },
    propertyName: {
        type: mongoose_1.Schema.Types.String
    },
    invoiceUrl: { type: mongoose_1.Schema.Types.String, trim: true },
    propertyAddress: {
        type: mongoose_1.Schema.Types.String
    },
    category: {
        "name": { type: mongoose_1.Schema.Types.String },
        "description": { type: mongoose_1.Schema.Types.String },
        "iconImage": { type: mongoose_1.Schema.Types.String },
        colorCode: { type: mongoose_1.Schema.Types.String },
        "options": { type: [mongoose_1.Schema.Types.String] },
        "_id": 0
    },
    subCategory: {
        "name": { type: mongoose_1.Schema.Types.String },
        "description": { type: mongoose_1.Schema.Types.String },
        "iconImage": { type: mongoose_1.Schema.Types.String },
        "parentId": { type: mongoose_1.Schema.Types.ObjectId },
        "_id": 0
    },
    countryId: {
        type: mongoose_1.Schema.Types.ObjectId
    },
    cityId: {
        type: mongoose_1.Schema.Types.ObjectId
    },
    promotionStatus: {
        type: mongoose_1.Schema.Types.Number,
        enum: _common_1.ENUM_ARRAY.PROPERTY.PROMO_STATUS,
        default: _common_1.ENUM.PROPERTY.PROMOTION_STATUS.PENDING
    },
    hostId: {
        type: mongoose_1.Schema.Types.ObjectId
    },
    fromDate: {
        type: mongoose_1.Schema.Types.Date
    },
    toDate: {
        type: mongoose_1.Schema.Types.Date
    },
    duration: {
        type: mongoose_1.Schema.Types.Number,
        enum: _common_1.ENUM_ARRAY.PROPERTY.PROMO_DURATION,
        default: _common_1.ENUM.PROPERTY.PROMOTION.DURATION.DAILY
    },
    slotType: { type: mongoose_1.Schema.Types.Number },
    transactionDetail: {
        transactionId: { type: mongoose_1.Schema.Types.String },
        stripeTransactionId: { type: mongoose_1.Schema.Types.String },
        transactionDate: { type: mongoose_1.Schema.Types.Date },
        transactionMethod: { type: mongoose_1.Schema.Types.String },
        last4: { type: mongoose_1.Schema.Types.String, trim: true },
        transactionStatus: {
            type: mongoose_1.Schema.Types.Number,
            enum: _common_1.ENUM_ARRAY.PAYMENT.STATUS,
            default: _common_1.ENUM.PAYMENT.STATUS.PENDING
        },
        price: { type: mongoose_1.Schema.Types.Number },
        totalPrice: { type: mongoose_1.Schema.Types.Number },
        tax: { type: mongoose_1.Schema.Types.Number },
        taxPercentage: { type: mongoose_1.Schema.Types.Number },
        dailyPrice: { type: mongoose_1.Schema.Types.Number }
    },
    analytics: {
        viewCount: { type: mongoose_1.Schema.Types.Number, default: 0 }
    },
    listingType: {
        type: mongoose_1.Schema.Types.Number,
        enum: _common_1.ENUM_ARRAY.ADVERTISEMENT.ListingPlacement
    }
}, {
    versionKey: false,
    collection: _common_1.ENUM.COL.PROMOTION,
    timestamps: true
});
exports.default = mongoose_1.model(_common_1.ENUM.COL.PROMOTION, promotionSchema);
//# sourceMappingURL=host.promotion.model.js.map