"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const _common_1 = require("@common");
const propertySpaceSchema = new mongoose_1.Schema({
    isOfferPrice: {
        type: mongoose_1.Schema.Types.Number,
        enum: [
            _common_1.ENUM.IS_OFFER_PRICE.TRUE,
            _common_1.ENUM.IS_OFFER_PRICE.FALSE
        ],
        required: true
    },
    subCategory: {
        _id: 0,
        name: { type: mongoose_1.Schema.Types.String },
        description: { type: mongoose_1.Schema.Types.String },
        iconImage: { type: mongoose_1.Schema.Types.String },
        parentId: { type: mongoose_1.Schema.Types.ObjectId }
    },
    category: {
        _id: 0,
        name: { type: mongoose_1.Schema.Types.String },
        description: { type: mongoose_1.Schema.Types.String },
        iconImage: { type: mongoose_1.Schema.Types.String },
        colorCode: { type: mongoose_1.Schema.Types.String },
        options: { type: [mongoose_1.Schema.Types.String] }
    },
    propertyId: { type: mongoose_1.Schema.Types.ObjectId, required: true, index: true },
    floorNumber: { type: mongoose_1.Schema.Types.Number, required: true, index: true, },
    floorDescription: { type: mongoose_1.Schema.Types.String },
    floorLabel: { type: mongoose_1.Schema.Types.String },
    include: [{ type: mongoose_1.Schema.Types.String }],
    userId: { type: mongoose_1.Schema.Types.ObjectId },
    partnerId: { type: mongoose_1.Schema.Types.ObjectId },
    userName: { type: mongoose_1.Schema.Types.String },
    propertyName: { type: mongoose_1.Schema.Types.String },
    capacity: { type: mongoose_1.Schema.Types.Number },
    totalUnits: { type: mongoose_1.Schema.Types.Number },
    isLowest: { type: mongoose_1.Schema.Types.Number, default: 0 },
    status: { type: mongoose_1.Schema.Types.String, default: _common_1.ENUM.PROPERTY.STATUS.ACTIVE },
    units: { type: mongoose_1.Schema.Types.Number, index: true },
    pricing: {
        hourly: { type: mongoose_1.Schema.Types.Number, default: 0 },
        daily: { type: mongoose_1.Schema.Types.Number, default: 0 },
        monthly: { type: mongoose_1.Schema.Types.Number, default: 0 }
    },
    bookingType: {
        type: mongoose_1.Schema.Types.Number,
        enum: _common_1.ENUM_ARRAY.USER_BOOKING_TYPE.BOOKING_TYPE,
        required: true,
        index: true
    },
    isEmployee: { type: mongoose_1.Schema.Types.Boolean, default: false },
    position: {
        x: { type: mongoose_1.Schema.Types.Number, default: 0 },
        y: { type: mongoose_1.Schema.Types.Number, default: 0 }
    },
    gridRow: { type: mongoose_1.Schema.Types.Number },
    gridColumn: { type: mongoose_1.Schema.Types.Number },
    floorImage: { type: mongoose_1.Schema.Types.String },
    spaceLabel: { type: mongoose_1.Schema.Types.String, trim: true }
}, {
    versionKey: false,
    collection: _common_1.ENUM.COL.PROPERTY_SPACE,
    timestamps: true
});
exports.default = mongoose_1.model(_common_1.ENUM.COL.PROPERTY_SPACE, propertySpaceSchema);
//# sourceMappingURL=propertySpaces.model.js.map