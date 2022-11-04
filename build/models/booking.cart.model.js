"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const _common_1 = require("@common");
const bookingCartSchema = new mongoose_1.Schema({
    cartInfo: [{
            _id: 0,
            spaceId: { type: mongoose_1.SchemaTypes.ObjectId, required: true, index: true },
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
    hostId: { type: mongoose_1.SchemaTypes.ObjectId, required: true, index: true },
    deviceId: { type: String, index: true, required: true },
    quantity: { type: Number, index: true, required: true },
    floorNumber: { type: Number, index: true, required: true },
    floorDescription: { type: String, index: true },
    floorLabel: { type: String, index: true },
    totalSpaceCapacity: { type: Number, required: true },
    fromDate: { type: mongoose_1.SchemaTypes.Date, required: true, index: true },
    toDate: { type: mongoose_1.SchemaTypes.Date, required: true, index: true },
    paymentType: { type: mongoose_1.Schema.Types.String },
    totalPayable: { type: mongoose_1.Schema.Types.Number, index: true },
    monthlyPayable: { type: mongoose_1.Schema.Types.Number },
    basePrice: { type: mongoose_1.Schema.Types.Number, index: true },
    shareUrl: { type: mongoose_1.Schema.Types.String },
    offerPrice: { type: mongoose_1.Schema.Types.Number },
    offerLabelType: { type: mongoose_1.Schema.Types.Mixed },
    userData: {
        userId: { type: mongoose_1.SchemaTypes.ObjectId, index: true },
        status: { type: mongoose_1.Schema.Types.String },
        name: { type: mongoose_1.Schema.Types.String },
        image: { type: mongoose_1.Schema.Types.String },
        email: { type: mongoose_1.Schema.Types.String },
        phoneNo: { type: mongoose_1.Schema.Types.String },
        countryCode: { type: mongoose_1.Schema.Types.String },
        createdAt: { type: mongoose_1.Schema.Types.Date },
        dob: { type: mongoose_1.Schema.Types.Date },
        bio: { type: mongoose_1.Schema.Types.String },
        profileStatus: { type: mongoose_1.Schema.Types.Number }
    },
    taxPercentage: { type: mongoose_1.Schema.Types.Number },
    taxes: { type: mongoose_1.Schema.Types.Number },
    propertyData: {
        propertyId: {
            type: mongoose_1.Schema.Types.ObjectId,
            required: true,
            index: true
        },
        status: { type: mongoose_1.Schema.Types.String },
        name: { type: mongoose_1.Schema.Types.String },
        images: [{ type: mongoose_1.Schema.Types.String }],
        address: { type: mongoose_1.Schema.Types.String },
        hostName: { type: mongoose_1.Schema.Types.String },
        autoAcceptUpcomingBooking: {
            type: mongoose_1.Schema.Types.Boolean,
            default: false
        },
        hostImage: {
            type: mongoose_1.Schema.Types.String,
            trim: true
        },
        hostEmail: {
            type: mongoose_1.Schema.Types.String,
            trim: true
        }
    },
    bookingType: {
        type: mongoose_1.Schema.Types.Number,
        enum: _common_1.ENUM_ARRAY.USER_BOOKING_TYPE.BOOKING_TYPE,
        index: true
    },
    isEmployee: {
        type: mongoose_1.Schema.Types.Boolean,
        default: false,
        index: true
    },
    bookingDuration: {
        months: { type: mongoose_1.Schema.Types.Number, index: true },
        days: { type: mongoose_1.Schema.Types.Number, index: true },
        totalDays: { type: mongoose_1.Schema.Types.Number, index: true },
        totalHours: { type: mongoose_1.Schema.Types.Number, index: true }
    },
    subCategory: {
        "name": { type: mongoose_1.SchemaTypes.String },
        "description": { type: mongoose_1.SchemaTypes.String },
        "iconImage": { type: mongoose_1.SchemaTypes.String },
        "parentId": { type: mongoose_1.Schema.Types.ObjectId },
        "_id": 0
    },
    category: {
        "name": { type: mongoose_1.SchemaTypes.String },
        colorCode: { type: mongoose_1.SchemaTypes.String },
        "description": { type: mongoose_1.SchemaTypes.String },
        "iconImage": { type: mongoose_1.SchemaTypes.String },
        "options": { type: [mongoose_1.SchemaTypes.String] },
        "_id": 0
    },
    partnerId: { type: mongoose_1.SchemaTypes.ObjectId, index: true },
}, {
    collection: _common_1.ENUM.COL.BOOKING_CART,
    timestamps: true
});
exports.default = mongoose_1.model(_common_1.ENUM.COL.BOOKING_CART, bookingCartSchema);
//# sourceMappingURL=booking.cart.model.js.map