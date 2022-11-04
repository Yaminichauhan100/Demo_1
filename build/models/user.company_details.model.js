"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const userCompanySchema = new mongoose_1.Schema({
    emailVerificationToken: { type: mongoose_1.SchemaTypes.String, trim: true },
    resetPasswordToken: { type: mongoose_1.SchemaTypes.String, trim: true },
    name: { type: mongoose_1.Schema.Types.String, },
    email: { type: mongoose_1.Schema.Types.String },
    address: { type: mongoose_1.Schema.Types.String },
    countryCode: { type: mongoose_1.Schema.Types.String },
    subCompanyType: { type: mongoose_1.Schema.Types.Number, enum: common_1.ENUM_ARRAY.USER.SUB_COMPANY_TYPE },
    status: { type: mongoose_1.Schema.Types.String, default: common_1.ENUM.PROPERTY.STATUS.ACTIVE },
    country: {
        sortname: { type: mongoose_1.SchemaTypes.String },
        name: { type: mongoose_1.SchemaTypes.String },
        id: { type: mongoose_1.SchemaTypes.Number },
        _id: 0
    },
    state: {
        id: { type: mongoose_1.SchemaTypes.Number },
        name: { type: mongoose_1.SchemaTypes.String },
        _id: 0
    },
    city: {
        name: { type: mongoose_1.SchemaTypes.String },
        iconImage: { type: mongoose_1.SchemaTypes.String },
        _id: 0
    },
    phoneNo: { type: mongoose_1.Schema.Types.String },
    houseNo: { type: mongoose_1.Schema.Types.String },
    street: { type: mongoose_1.Schema.Types.String },
    landmark: { type: mongoose_1.Schema.Types.String },
    zipCode: { type: mongoose_1.Schema.Types.String },
    taxNo: { type: mongoose_1.Schema.Types.String },
    regNo: { type: mongoose_1.Schema.Types.String },
    documents: [{ type: mongoose_1.SchemaTypes.String }],
    profilePicture: { type: mongoose_1.Schema.Types.String },
    userId: { type: mongoose_1.Schema.Types.ObjectId },
    isDelete: { type: mongoose_1.Schema.Types.Boolean, default: false },
    tncAgreed: { type: mongoose_1.Schema.Types.Boolean, default: true }
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.USER_COMPANY_Details,
    timestamps: true
});
userCompanySchema.index({ "location": "2dsphere" });
exports.default = mongoose_1.model(common_1.ENUM.COL.USER_COMPANY_Details, userCompanySchema);
//# sourceMappingURL=user.company_details.model.js.map