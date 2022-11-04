"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const hostSchema = new mongoose_1.Schema({
    emailVerificationToken: { type: mongoose_1.SchemaTypes.String, trim: true },
    google_refresh_token: { type: mongoose_1.SchemaTypes.String, trim: true },
    googleCalendarSyncedAt: { type: mongoose_1.Schema.Types.Date },
    googleCalendarSyncStatus: { type: mongoose_1.Schema.Types.Boolean },
    outlookCalendarSyncedAt: { type: mongoose_1.Schema.Types.Date },
    outlookCalendarSyncStatus: { type: mongoose_1.Schema.Types.Boolean },
    resetPasswordToken: { type: mongoose_1.SchemaTypes.String, trim: true },
    name: { type: mongoose_1.Schema.Types.String, },
    email: { type: mongoose_1.Schema.Types.String, lowercase: true, trim: true },
    password: { type: mongoose_1.Schema.Types.String },
    companyType: { type: mongoose_1.Schema.Types.String },
    subCompanyType: { type: mongoose_1.Schema.Types.Number, enum: common_1.ENUM_ARRAY.USER.SUB_COMPANY_TYPE },
    accessLevel: { type: mongoose_1.Schema.Types.Number, default: common_1.ENUM.COHOST_LEVEL.STATUS.ALL },
    countryCode: { type: mongoose_1.Schema.Types.String },
    phoneNo: { type: mongoose_1.Schema.Types.String },
    commissionAmount: { type: mongoose_1.Schema.Types.Number, default: 10 },
    location: {
        type: { type: mongoose_1.Schema.Types.String },
        coordinates: []
    },
    address: { type: mongoose_1.Schema.Types.String },
    houseNo: { type: mongoose_1.Schema.Types.String },
    street: { type: mongoose_1.Schema.Types.String },
    landmark: { type: mongoose_1.Schema.Types.String },
    zipCode: { type: mongoose_1.Schema.Types.String },
    status: { type: mongoose_1.Schema.Types.String, enum: common_1.ENUM_ARRAY.USER.STATUS, default: common_1.ENUM.USER.STATUS.ACTIVE },
    type: { type: mongoose_1.Schema.Types.Number, enum: common_1.ENUM_ARRAY.USER.TYPE, default: common_1.ENUM.USER.TYPE.HOST },
    phoneVerified: { type: mongoose_1.Schema.Types.Boolean, default: false },
    emailVerified: { type: mongoose_1.Schema.Types.Boolean, default: false },
    resetToken: { type: mongoose_1.Schema.Types.String },
    linkedInId: { type: mongoose_1.Schema.Types.String },
    facebookId: { type: mongoose_1.Schema.Types.String },
    appleId: { type: mongoose_1.Schema.Types.String },
    image: { type: mongoose_1.Schema.Types.String, default: common_1.CONSTANT.PLACEHOLDER },
    bio: { type: mongoose_1.Schema.Types.String },
    dob: { type: mongoose_1.Schema.Types.Date },
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
    stripeAccountId: {
        type: mongoose_1.Schema.Types.String
    },
    stripeCustomerId: {
        type: mongoose_1.Schema.Types.String
    },
    stripeAccountStatus: {
        type: mongoose_1.Schema.Types.String
    },
    hostId: { type: mongoose_1.Schema.Types.ObjectId },
    isCohost: { type: mongoose_1.Schema.Types.Number },
    permissions: [{ type: mongoose_1.Schema.Types.Number }],
    coHost: [{ type: mongoose_1.SchemaTypes.ObjectId }],
    level: { type: mongoose_1.SchemaTypes.Number },
    fbUrl: { type: mongoose_1.SchemaTypes.String },
    twitterUrl: { type: mongoose_1.SchemaTypes.String },
    linkedinUrl: { type: mongoose_1.SchemaTypes.String },
    instaUrl: { type: mongoose_1.SchemaTypes.String },
    youtubeUrl: { type: mongoose_1.SchemaTypes.String },
    slackUrl: { type: mongoose_1.SchemaTypes.String },
    deletedClient: [{ type: mongoose_1.SchemaTypes.ObjectId }],
    lastPayoutDate: { type: mongoose_1.Schema.Types.Date },
    propertyCount: { type: mongoose_1.Schema.Types.Number, default: 0 },
    otpCount: { type: mongoose_1.Schema.Types.Number }
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.HOST,
    timestamps: true
});
hostSchema.index({ "location": "2dsphere" });
exports.default = mongoose_1.model(common_1.ENUM.COL.HOST, hostSchema);
//# sourceMappingURL=host.model.js.map