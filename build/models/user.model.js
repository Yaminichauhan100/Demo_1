"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const userSchema = new mongoose_1.Schema({
    emailVerificationToken: { type: mongoose_1.SchemaTypes.String, trim: true },
    google_refresh_token: { type: mongoose_1.SchemaTypes.String, trim: true },
    googleCalendarSyncedAt: { type: mongoose_1.Schema.Types.Date },
    googleCalendarSyncStatus: { type: mongoose_1.Schema.Types.Boolean },
    outlookCalendarSyncedAt: { type: mongoose_1.Schema.Types.Date },
    outlookCalendarSyncStatus: { type: mongoose_1.Schema.Types.Boolean },
    resetPasswordToken: { type: mongoose_1.SchemaTypes.String, trim: true },
    name: { type: mongoose_1.Schema.Types.String, trim: true },
    email: { type: mongoose_1.Schema.Types.String, lowercase: true, trim: true },
    password: { type: mongoose_1.Schema.Types.String },
    companyType: { type: mongoose_1.Schema.Types.String, trim: true },
    subCompanyType: { type: mongoose_1.Schema.Types.Number, enum: common_1.ENUM_ARRAY.USER.SUB_COMPANY_TYPE },
    countryCode: { type: mongoose_1.Schema.Types.String, trim: true },
    phoneNo: { type: mongoose_1.Schema.Types.String, trim: true },
    location: {
        type: { type: mongoose_1.Schema.Types.String },
        coordinates: []
    },
    notificationEnabled: {
        type: mongoose_1.Schema.Types.Number, enum: [
            common_1.ENUM_ARRAY.NOTIFICATION.ENABLE,
            common_1.ENUM_ARRAY.NOTIFICATION.DISABLE
        ],
        default: common_1.ENUM_ARRAY.NOTIFICATION.ENABLE
    },
    mailNotificationEnabled: {
        type: mongoose_1.Schema.Types.Number, enum: [
            common_1.ENUM_ARRAY.NOTIFICATION.ENABLE,
            common_1.ENUM_ARRAY.NOTIFICATION.DISABLE
        ],
        default: common_1.ENUM_ARRAY.NOTIFICATION.ENABLE
    },
    address: { type: mongoose_1.Schema.Types.String },
    houseNo: { type: mongoose_1.Schema.Types.String },
    street: { type: mongoose_1.Schema.Types.String },
    landmark: { type: mongoose_1.Schema.Types.String },
    zipCode: { type: mongoose_1.Schema.Types.String },
    status: { type: mongoose_1.Schema.Types.String, enum: common_1.ENUM_ARRAY.USER.STATUS, default: common_1.ENUM.USER.STATUS.ACTIVE },
    type: { type: mongoose_1.Schema.Types.Number, enum: common_1.ENUM_ARRAY.USER.TYPE, default: common_1.ENUM.USER.TYPE.USER },
    phoneVerified: { type: mongoose_1.Schema.Types.Boolean, default: false },
    emailVerified: { type: mongoose_1.Schema.Types.Boolean, default: false },
    resetToken: { type: mongoose_1.Schema.Types.String },
    linkedInId: { type: mongoose_1.Schema.Types.String },
    facebookId: { type: mongoose_1.Schema.Types.String },
    appleId: { type: mongoose_1.Schema.Types.String },
    image: { type: mongoose_1.Schema.Types.String, default: common_1.CONSTANT.PLACEHOLDER },
    bio: { type: mongoose_1.Schema.Types.String },
    dob: { type: mongoose_1.Schema.Types.Date },
    accountStatus: { type: mongoose_1.Schema.Types.String, enum: common_1.ENUM_ARRAY.USER.ACCOUNT_STATUS, default: common_1.ENUM.USER.ACCOUNT_STATUS.UNVERIFIED },
    profileCompleted: { type: mongoose_1.Schema.Types.Boolean, default: false },
    tempPhoneNo: { type: mongoose_1.Schema.Types.String },
    tempCountryCode: { type: mongoose_1.Schema.Types.String },
    subscribeEmail: { type: mongoose_1.Schema.Types.Boolean, default: false },
    deviceDetails: {
        type: { type: Number, enum: common_1.ENUM.USER.DEVICE_TYPE },
        token: { type: String, trim: true },
        deviceId: { type: String },
        _id: 0
    },
    gender: { type: mongoose_1.Schema.Types.String },
    govIdProof: {
        name: { type: mongoose_1.Schema.Types.String },
        number: { type: mongoose_1.Schema.Types.String }
    },
    stripeCustomerId: { type: mongoose_1.Schema.Types.String },
    profileStatus: {
        type: mongoose_1.Schema.Types.Number,
        enum: common_1.ENUM_ARRAY.USER.PROFILE_STATUS,
        default: common_1.ENUM.USER.PROFILE_STATUS.BEGINNER
    },
    passbaseToken: { type: mongoose_1.Schema.Types.String, trim: true },
    passbaseVerification: { type: mongoose_1.Schema.Types.Number, default: 0 },
    partnerId: [{ type: mongoose_1.Schema.Types.ObjectId }],
    bookingCount: { type: mongoose_1.Schema.Types.Number, default: 0 },
    otpCount: { type: mongoose_1.Schema.Types.Number }
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.USER,
    timestamps: true
});
userSchema.index({ "location": "2dsphere" });
exports.default = mongoose_1.model(common_1.ENUM.COL.USER, userSchema);
//# sourceMappingURL=user.model.js.map