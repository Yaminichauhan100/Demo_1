"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const adminAdPriceSchema = new mongoose_1.Schema({
    "isDelete": { type: mongoose_1.SchemaTypes.Boolean, default: false },
    category: {
        "name": { type: mongoose_1.SchemaTypes.String },
        "description": { type: mongoose_1.SchemaTypes.String },
        "iconImage": { type: mongoose_1.SchemaTypes.String },
        colorCode: { type: mongoose_1.SchemaTypes.String },
        "options": { type: [mongoose_1.SchemaTypes.String] },
        "_id": 0
    },
    subCategory: {
        "name": { type: mongoose_1.SchemaTypes.String },
        "description": { type: mongoose_1.SchemaTypes.String },
        "iconImage": { type: mongoose_1.SchemaTypes.String },
        "parentId": { type: mongoose_1.Schema.Types.ObjectId },
        "_id": 0
    },
    country: {
        sortname: { type: mongoose_1.SchemaTypes.String },
        name: { type: mongoose_1.SchemaTypes.String },
        id: { type: mongoose_1.SchemaTypes.Number },
        tax: { type: mongoose_1.SchemaTypes.Number },
        _id: 0
    },
    state: {
        id: { type: mongoose_1.SchemaTypes.Number },
        name: { type: mongoose_1.SchemaTypes.String },
        _id: 0
    },
    city: {
        cityName: { type: mongoose_1.SchemaTypes.String },
        iconImage: { type: mongoose_1.SchemaTypes.String },
        isFeatured: { type: mongoose_1.SchemaTypes.Boolean },
        _id: 0
    },
    slotType: {
        1: {
            daily: mongoose_1.SchemaTypes.Number,
            weekly: mongoose_1.SchemaTypes.Number,
            monthly: mongoose_1.SchemaTypes.Number
        },
        2: {
            daily: mongoose_1.SchemaTypes.Number,
            weekly: mongoose_1.SchemaTypes.Number,
            monthly: mongoose_1.SchemaTypes.Number
        },
        3: {
            daily: mongoose_1.SchemaTypes.Number,
            weekly: mongoose_1.SchemaTypes.Number,
            monthly: mongoose_1.SchemaTypes.Number
        },
    },
    listingPlacement: { type: mongoose_1.SchemaTypes.Number, enum: common_1.ENUM_ARRAY.ADVERTISEMENT.ListingPlacement }
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.AD_PRICE,
    timestamps: true
});
exports.default = mongoose_1.model(common_1.ENUM.COL.AD_PRICE, adminAdPriceSchema);
//# sourceMappingURL=admin.advprice.model.js.map