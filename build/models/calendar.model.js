"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const calendarSchema = new mongoose_1.Schema({
    date: { type: mongoose_1.Schema.Types.Date },
    hostId: { type: mongoose_1.Schema.Types.ObjectId },
    propertyId: { type: mongoose_1.Schema.Types.ObjectId },
    bookingDetails: [
        {
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
                "options": { type: [mongoose_1.Schema.Types.String] },
                colorCode: { type: mongoose_1.Schema.Types.String },
                "_id": 0
            },
            bookingId: { type: mongoose_1.Schema.Types.ObjectId },
            bookingMode: { type: mongoose_1.Schema.Types.Number, enum: common_1.ENUM_ARRAY.BOOKING_MODE.TYPE },
            quantity: { type: mongoose_1.Schema.Types.Number },
            bookingStatus: {
                type: mongoose_1.Schema.Types.Number,
                enum: common_1.ENUM_ARRAY.BOOKING.STATUS,
                default: common_1.ENUM.BOOKING.STATUS.ABANDONED
            }
        }
    ]
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.CALENDAR,
    timestamps: true
});
exports.default = mongoose_1.model(common_1.ENUM.COL.CALENDAR, calendarSchema);
//# sourceMappingURL=calendar.model.js.map