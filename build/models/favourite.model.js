"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const property = new mongoose_1.Schema({
    _id: { type: mongoose_1.SchemaTypes.ObjectId },
    images: { type: [mongoose_1.SchemaTypes.String] },
    name: { type: mongoose_1.SchemaTypes.String },
    isBooked: { type: mongoose_1.Schema.Types.Boolean, default: false },
    address: {
        type: mongoose_1.SchemaTypes.String, enum: [
            common_1.ENUM.FAV_PROPERTY_STATUS.STATUS.ACTIVE,
            common_1.ENUM.FAV_PROPERTY_STATUS.STATUS.INACTIVE,
            common_1.ENUM.FAV_PROPERTY_STATUS.STATUS.ISDELETE,
        ],
        default: common_1.ENUM.FAV_PROPERTY_STATUS.STATUS.ACTIVE
    },
    status: { type: mongoose_1.SchemaTypes.String },
    startingPrice: { type: mongoose_1.SchemaTypes.Number },
    rating: {
        avgRating: { type: mongoose_1.SchemaTypes.Number },
        count: { type: mongoose_1.SchemaTypes.Number },
    },
    country: {
        _id: { type: mongoose_1.SchemaTypes.ObjectId },
        id: { type: mongoose_1.SchemaTypes.Number },
        sortname: { type: mongoose_1.SchemaTypes.String },
        name: { type: mongoose_1.SchemaTypes.String },
    },
    city: {
        _id: { type: mongoose_1.SchemaTypes.ObjectId },
        cityName: { type: mongoose_1.SchemaTypes.String },
        iconImage: { type: mongoose_1.SchemaTypes.String },
    },
    state: {
        _id: { type: mongoose_1.SchemaTypes.ObjectId },
        id: { type: mongoose_1.SchemaTypes.Number },
        name: { type: mongoose_1.SchemaTypes.String },
    }
}, {
    versionKey: false,
    _id: false
});
const favouriteSchema = new mongoose_1.Schema({
    property: property,
    userId: { type: mongoose_1.SchemaTypes.ObjectId },
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.FAVOURITE,
    timestamps: true
});
favouriteSchema.index({ propertyId: 1, userId: 1 });
favouriteSchema.index({ userId: 1, isBooked: 1 });
exports.default = mongoose_1.model(common_1.ENUM.COL.FAVOURITE, favouriteSchema);
//# sourceMappingURL=favourite.model.js.map