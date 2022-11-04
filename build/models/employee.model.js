"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const partnerSchema = new mongoose_1.Schema({
    name: { type: mongoose_1.Schema.Types.String, trim: true },
    email: { type: mongoose_1.Schema.Types.String, lowercase: true, trim: true },
    countryCode: { type: mongoose_1.Schema.Types.String },
    phoneNo: { type: mongoose_1.Schema.Types.String },
    status: { type: mongoose_1.Schema.Types.String, enum: common_1.ENUM_ARRAY.USER.STATUS, default: common_1.ENUM.USER.STATUS.ACTIVE },
    image: { type: mongoose_1.Schema.Types.String, default: common_1.CONSTANT.PLACEHOLDER },
    partnerId: { type: mongoose_1.Schema.Types.ObjectId },
    userId: { type: mongoose_1.Schema.Types.ObjectId },
    partnerStatus: { type: mongoose_1.Schema.Types.String, default: common_1.ENUM.USER.STATUS.ACTIVE },
    propertyId: { type: mongoose_1.Schema.Types.ObjectId }
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.EMPLOYEES,
    timestamps: true
});
exports.default = mongoose_1.model(common_1.ENUM.COL.EMPLOYEES, partnerSchema);
//# sourceMappingURL=employee.model.js.map