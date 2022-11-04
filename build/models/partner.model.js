"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const partnerSchema = new mongoose_1.Schema({
    name: { type: mongoose_1.Schema.Types.String, trim: true },
    email: { type: mongoose_1.Schema.Types.String, lowercase: true, trim: true },
    countryCode: { type: mongoose_1.Schema.Types.String },
    phoneNo: { type: mongoose_1.Schema.Types.String },
    address: { type: mongoose_1.Schema.Types.String },
    lane1: { type: mongoose_1.Schema.Types.String },
    lane2: { type: mongoose_1.Schema.Types.String },
    zipCode: { type: mongoose_1.Schema.Types.String },
    partnerType: { type: mongoose_1.Schema.Types.Number, enum: common_1.ENUM_ARRAY.PROPERTY.PROPERTY_TYPE },
    partnerFloors: [{ type: mongoose_1.Schema.Types.Number }],
    status: { type: mongoose_1.Schema.Types.String, enum: common_1.ENUM_ARRAY.USER.STATUS, default: common_1.ENUM.USER.STATUS.ACTIVE },
    image: { type: mongoose_1.Schema.Types.String, default: common_1.CONSTANT.PLACEHOLDER },
    hostId: { type: mongoose_1.Schema.Types.ObjectId },
    totalEmployees: { type: mongoose_1.Schema.Types.Number, default: 0 },
    activeEmployees: { type: mongoose_1.Schema.Types.Number, default: 0 },
    state: {
        _id: 0,
        id: { type: mongoose_1.Schema.Types.Number },
        name: { type: mongoose_1.Schema.Types.String }
    },
    city: {
        _id: 0,
        id: { type: mongoose_1.Schema.Types.ObjectId },
        cityName: { type: mongoose_1.Schema.Types.String }
    },
    property: {
        _id: 0,
        id: { type: mongoose_1.Schema.Types.ObjectId },
        name: { type: mongoose_1.Schema.Types.String }
    },
    country: {
        _id: 0,
        id: { type: mongoose_1.Schema.Types.Number },
        name: { type: mongoose_1.Schema.Types.String }
    }
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.PARTNERS,
    timestamps: true
});
exports.default = mongoose_1.model(common_1.ENUM.COL.PARTNERS, partnerSchema);
//# sourceMappingURL=partner.model.js.map