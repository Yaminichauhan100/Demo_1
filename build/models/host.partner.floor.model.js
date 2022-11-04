"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const PartnerFLoorSchema = new mongoose_1.Schema({
    partnerId: { type: mongoose_1.Schema.Types.ObjectId },
    spaceId: { type: mongoose_1.Schema.Types.ObjectId },
    subCategory: {
        "name": { type: mongoose_1.Schema.Types.String },
        "description": { type: mongoose_1.Schema.Types.String },
        "iconImage": { type: mongoose_1.Schema.Types.String },
        "parentId": { type: mongoose_1.Schema.Types.ObjectId },
        "_id": 0
    },
    category: {
        "name": { type: mongoose_1.Schema.Types.String },
        "description": { type: mongoose_1.Schema.Types.String },
        "iconImage": { type: mongoose_1.Schema.Types.String },
        colorCode: { type: mongoose_1.Schema.Types.String },
        "options": { type: [mongoose_1.Schema.Types.String] },
        "_id": 0
    },
    propertyId: { type: mongoose_1.Schema.Types.ObjectId },
    capacity: { type: mongoose_1.Schema.Types.Number },
    floorNumber: {
        type: mongoose_1.Schema.Types.Number,
        index: true,
    },
    floorDescription: { type: mongoose_1.Schema.Types.String },
    floorLabel: { type: mongoose_1.Schema.Types.String },
    status: {
        type: mongoose_1.Schema.Types.String,
        default: common_1.ENUM.PROPERTY.STATUS.ACTIVE
    },
    employeeUnits: { type: mongoose_1.Schema.Types.Number },
    pricing: {
        hourly: { type: mongoose_1.Schema.Types.Number },
        daily: { type: mongoose_1.Schema.Types.Number },
        monthly: { type: mongoose_1.Schema.Types.Number }
    },
    isLowest: { type: mongoose_1.Schema.Types.Number, default: 0 }
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.PartnerFloor,
    timestamps: true
});
PartnerFLoorSchema.index({ "propertyId": 1 });
PartnerFLoorSchema.index({ "partnerId": 1 });
PartnerFLoorSchema.index({ "totalUnits": 1 });
PartnerFLoorSchema.index({ "floorNumber": 1 });
exports.default = mongoose_1.model(common_1.ENUM.COL.PartnerFloor, PartnerFLoorSchema);
//# sourceMappingURL=host.partner.floor.model.js.map