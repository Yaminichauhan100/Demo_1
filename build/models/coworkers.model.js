"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const coworkerSchema = new mongoose_1.Schema({
    name: { type: mongoose_1.Schema.Types.String, default: "" },
    email: { type: mongoose_1.Schema.Types.String, lowercase: true, trim: true, default: "" },
    status: {
        type: mongoose_1.Schema.Types.Number,
        enum: common_1.ENUM_ARRAY.USER.INIVITATION_STATUS,
        default: common_1.ENUM.USER.INIVITATION_STATUS.PENDING
    },
    image: { type: mongoose_1.Schema.Types.String, default: common_1.CONSTANT.PLACEHOLDER },
    userId: { type: mongoose_1.Schema.Types.ObjectId },
    ownerDetail: {
        userId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
        status: { type: mongoose_1.Schema.Types.String },
        name: { type: mongoose_1.Schema.Types.String },
        image: { type: mongoose_1.Schema.Types.String },
        email: { type: mongoose_1.Schema.Types.String },
        phoneNo: { type: mongoose_1.Schema.Types.String },
        createdAt: { type: mongoose_1.Schema.Types.Date },
        countryCode: { type: mongoose_1.Schema.Types.String },
        dob: { type: mongoose_1.Schema.Types.Date },
        profileStatus: { type: mongoose_1.Schema.Types.Number },
    },
    coworkerId: { type: mongoose_1.Schema.Types.ObjectId },
    isOwner: { type: mongoose_1.Schema.Types.Number, default: 0 },
    bookingId: { type: mongoose_1.Schema.Types.ObjectId },
    bookingNumber: { type: mongoose_1.Schema.Types.String },
    propertyId: { type: mongoose_1.Schema.Types.ObjectId },
    hostId: { type: mongoose_1.Schema.Types.ObjectId }
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.COWORKERS,
    timestamps: true
});
exports.default = mongoose_1.model(common_1.ENUM.COL.COWORKERS, coworkerSchema);
//# sourceMappingURL=coworkers.model.js.map