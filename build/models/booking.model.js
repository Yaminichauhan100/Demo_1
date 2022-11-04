"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const bookingSchema = new mongoose_1.Schema({
    hostId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    coworker: [{ type: mongoose_1.Schema.Types.String }],
    bookingId: { type: mongoose_1.Schema.Types.String },
    bookingStatus: {
        type: mongoose_1.Schema.Types.Number,
        enum: common_1.ENUM_ARRAY.BOOKING.STATUS,
        default: common_1.ENUM.BOOKING.STATUS.ABANDONED
    },
    totalPayable: { type: mongoose_1.Schema.Types.Number },
    adminCommission: { type: mongoose_1.Schema.Types.Number },
    monthlyPayable: { type: mongoose_1.Schema.Types.Number },
    taxes: { type: mongoose_1.Schema.Types.Number },
    taxPercentage: { type: mongoose_1.Schema.Types.Number },
    giftCardAmount: { type: mongoose_1.Schema.Types.Number },
    giftCardId: { type: mongoose_1.Schema.Types.ObjectId },
    giftCardStatus: {
        type: mongoose_1.Schema.Types.Number, enum: [
            common_1.ENUM.BOOKING.GIFT_CARD_STATUS.APPLIED,
            common_1.ENUM.BOOKING.GIFT_CARD_STATUS.QUEUED
        ]
    },
    cancelledBy: {
        type: mongoose_1.Schema.Types.Number, enum: [
            common_1.ENUM.USER.TYPE.USER,
            common_1.ENUM.USER.TYPE.HOST
        ]
    },
    isEmployee: {
        type: mongoose_1.Schema.Types.Boolean,
        default: false,
        index: true
    },
    bookingType: {
        type: mongoose_1.Schema.Types.Number,
        enum: common_1.ENUM_ARRAY.USER_BOOKING_TYPE.BOOKING_TYPE
    },
    floorDescription: { type: mongoose_1.Schema.Types.String, index: true },
    floorNumber: { type: mongoose_1.Schema.Types.Number, index: true },
    floorLabel: { type: String, index: true },
    partnerId: { type: mongoose_1.Schema.Types.ObjectId, index: true },
    invoiceUrl: { type: mongoose_1.Schema.Types.String, trim: true },
    hostInvoice: { type: mongoose_1.Schema.Types.String, trim: true },
    giftCardNo: { type: mongoose_1.Schema.Types.String },
    basePrice: { type: mongoose_1.Schema.Types.Number },
    userBookingStatus: {
        type: mongoose_1.Schema.Types.Number,
        enum: common_1.ENUM_ARRAY.USER_BOOKING_STATUS.STATUS,
        default: common_1.ENUM.USER_BOOKING_STATUS.STATUS.PENDING
    },
    transactionId: { type: mongoose_1.Schema.Types.String },
    bookingMode: { type: mongoose_1.Schema.Types.Number, enum: common_1.ENUM_ARRAY.BOOKING_MODE.TYPE, default: 0 },
    timing: { type: mongoose_1.Schema.Types.String, default: 'Full Day' },
    cartId: { type: mongoose_1.Schema.Types.ObjectId },
    deviceId: { type: String, index: true, required: true },
    quantity: { type: Number, index: true, required: true },
    cartInfo: [{
            _id: 0,
            spaceId: { type: mongoose_1.Schema.Types.ObjectId, required: true, index: true },
            pricing: {
                hourly: { type: mongoose_1.Schema.Types.Number },
                daily: { type: mongoose_1.Schema.Types.Number },
                monthly: { type: mongoose_1.Schema.Types.Number }
            },
            basePrice: { type: mongoose_1.Schema.Types.Number, index: true },
            spaceLabel: { type: mongoose_1.Schema.Types.String },
            position: {
                x: { type: mongoose_1.Schema.Types.Number, default: 0 },
                y: { type: mongoose_1.Schema.Types.Number, default: 0 }
            },
            gridRow: { type: mongoose_1.Schema.Types.Number },
            gridColumn: { type: mongoose_1.Schema.Types.Number },
            floorImage: { type: mongoose_1.Schema.Types.String }
        }],
    adminCommissionAmount: { type: mongoose_1.Schema.Types.Number, default: 10 },
    fromDate: { type: mongoose_1.Schema.Types.Date, required: true },
    toDate: { type: mongoose_1.Schema.Types.Date, required: true },
    occupancy: { type: mongoose_1.Schema.Types.Number },
    coworkerCount: { type: mongoose_1.Schema.Types.Number, default: 0, min: 0 },
    transactionDate: { type: mongoose_1.Schema.Types.Date, },
    paymentStatus: { type: mongoose_1.Schema.Types.Number, enum: common_1.ENUM_ARRAY.PAYMENT.STATUS, default: common_1.ENUM.PAYMENT.STATUS.PENDING },
    userData: {
        userId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
        status: { type: mongoose_1.Schema.Types.String },
        name: { type: mongoose_1.Schema.Types.String },
        image: { type: mongoose_1.Schema.Types.String },
        email: { type: mongoose_1.Schema.Types.String },
        phoneNo: { type: mongoose_1.Schema.Types.String },
        createdAt: { type: mongoose_1.Schema.Types.Date },
        countryCode: { type: mongoose_1.Schema.Types.String },
        dob: { type: mongoose_1.Schema.Types.Date },
        profileStatus: { type: mongoose_1.Schema.Types.Number },
        bio: { type: mongoose_1.Schema.Types.String },
    },
    shareUrl: { type: mongoose_1.Schema.Types.String },
    prolongedStatus: {
        type: mongoose_1.Schema.Types.Number,
        enum: common_1.ENUM_ARRAY.USER_BOOKING_STATUS.PROLONGED_STATUS
    },
    prolongBookingId: { type: mongoose_1.Schema.Types.ObjectId },
    propertyData: {
        propertyId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
        status: { type: mongoose_1.Schema.Types.String },
        hostStatus: { type: mongoose_1.Schema.Types.String },
        name: { type: mongoose_1.Schema.Types.String },
        address: { type: mongoose_1.Schema.Types.String },
        hostName: { type: mongoose_1.Schema.Types.String },
        images: [
            { type: mongoose_1.Schema.Types.String }
        ],
        autoAcceptUpcomingBooking: { type: mongoose_1.Schema.Types.Boolean, default: true },
        hostImage: { type: mongoose_1.Schema.Types.String },
        hostEmail: { type: mongoose_1.Schema.Types.String },
    },
    offerPrice: { type: mongoose_1.Schema.Types.Number },
    offerLabelType: { type: mongoose_1.Schema.Types.Mixed },
    totalSpaceCapacity: { type: Number, required: true },
    paymentPlan: { type: mongoose_1.Schema.Types.Number, enum: common_1.ENUM_ARRAY.PAYMENT.PLAN },
    transactionType: { type: mongoose_1.Schema.Types.Number, enum: common_1.ENUM_ARRAY.PAYMENT.PLAN },
    paymentMode: { type: mongoose_1.Schema.Types.String },
    last4: { type: mongoose_1.Schema.Types.String, trim: true },
    acceptedOn: { type: mongoose_1.Schema.Types.Date },
    rejectedOn: { type: mongoose_1.Schema.Types.Date },
    bookingDuration: {
        months: { type: mongoose_1.Schema.Types.Number, index: true },
        days: { type: mongoose_1.Schema.Types.Number, index: true },
        totalDays: { type: mongoose_1.Schema.Types.Number, index: true },
        totalHours: { type: mongoose_1.Schema.Types.Number, index: true }
    },
    reason: { type: mongoose_1.Schema.Types.String, trim: true },
    description: { type: mongoose_1.Schema.Types.String, trim: true },
    subCategory: {
        "name": { type: mongoose_1.Schema.Types.String },
        "description": { type: mongoose_1.Schema.Types.String },
        "iconImage": { type: mongoose_1.Schema.Types.String },
        "parentId": { type: mongoose_1.Schema.Types.ObjectId },
        "_id": 0
    },
    category: {
        colorCode: { type: mongoose_1.Schema.Types.String },
        "name": { type: mongoose_1.Schema.Types.String },
        "description": { type: mongoose_1.Schema.Types.String },
        "iconImage": { type: mongoose_1.Schema.Types.String },
        "options": { type: [mongoose_1.Schema.Types.String] },
        "_id": 0
    },
    reviewData: {
        _id: { type: mongoose_1.Schema.Types.ObjectId, required: false },
        rating: { type: mongoose_1.Schema.Types.Number, required: false },
        isFeatured: { type: mongoose_1.Schema.Types.Number },
        review: { type: mongoose_1.Schema.Types.String, required: false },
        createdAt: { type: mongoose_1.Schema.Types.Date },
        updatedAt: { type: mongoose_1.Schema.Types.Date },
        status: { type: mongoose_1.Schema.Types.String },
        reply: [{
                userId: {
                    type: mongoose_1.Schema.Types.ObjectId,
                },
                review: {
                    type: mongoose_1.Schema.Types.String,
                },
                createdAt: {
                    type: mongoose_1.Schema.Types.Date,
                },
                _id: 0
            }],
    }
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.BOOKING,
    timestamps: true
});
bookingSchema.index({ userId: 1, cartId: 1, bookingType: 1, bookingStatus: 1 });
exports.default = mongoose_1.model(common_1.ENUM.COL.BOOKING, bookingSchema);
//# sourceMappingURL=booking.model.js.map