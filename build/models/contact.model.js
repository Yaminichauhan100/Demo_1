"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const contactSchema = new mongoose_1.Schema({
    propertyId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    bookingId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    hostId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    name: {
        type: mongoose_1.Schema.Types.String,
    },
    email: {
        type: mongoose_1.Schema.Types.String,
    },
    companyName: {
        type: mongoose_1.Schema.Types.String,
    },
    phoneNo: {
        type: mongoose_1.Schema.Types.String,
    },
    message: {
        type: mongoose_1.Schema.Types.String,
    },
    otherMessage: {
        type: mongoose_1.Schema.Types.String,
    },
    subject: {
        _id: { type: mongoose_1.Schema.Types.ObjectId, },
        name: { type: mongoose_1.Schema.Types.String, }
    },
    countryCode: {
        type: mongoose_1.Schema.Types.String,
    },
    status: { type: mongoose_1.Schema.Types.String, default: common_1.ENUM.PROPERTY.STATUS.ACTIVE },
    resolutionStatus: {
        type: mongoose_1.Schema.Types.Number,
        default: common_1.ENUM.RESOLUTION_STATUS.STATUS.PENDING,
        enum: [
            common_1.ENUM.RESOLUTION_STATUS.STATUS.RESOLVED,
            common_1.ENUM.RESOLUTION_STATUS.STATUS.PENDING
        ]
    }
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.CONTACT,
    timestamps: true
});
exports.default = mongoose_1.model(common_1.ENUM.COL.CONTACT, contactSchema);
//# sourceMappingURL=contact.model.js.map