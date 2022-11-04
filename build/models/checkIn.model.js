"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const checkInSchema = new mongoose_1.Schema({
    bookingId: { type: mongoose_1.SchemaTypes.ObjectId },
    bookingNo: { type: mongoose_1.SchemaTypes.String },
    coworker: {
        _id: { type: mongoose_1.SchemaTypes.ObjectId },
        email: { type: mongoose_1.SchemaTypes.String },
        name: { type: mongoose_1.SchemaTypes.String },
        image: { type: mongoose_1.SchemaTypes.String },
    },
    userId: { type: mongoose_1.SchemaTypes.ObjectId },
    property: {
        _id: { type: mongoose_1.SchemaTypes.ObjectId, required: true, index: true },
        country: {
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
            cityName: { type: mongoose_1.SchemaTypes.String },
            iconImage: { type: mongoose_1.SchemaTypes.String },
            _id: 0
        },
    },
    date: { type: mongoose_1.SchemaTypes.Date },
    time: { type: mongoose_1.SchemaTypes.Date },
    status: { type: mongoose_1.Schema.Types.Number, default: common_1.ENUM.CHECKIN_STATUS.IN },
    remark: { type: mongoose_1.SchemaTypes.String },
}, {
    versionKey: false,
    timestamps: true,
    collection: common_1.ENUM.COL.CHECKIN
});
exports.default = mongoose_1.model(common_1.ENUM.COL.CHECKIN, checkInSchema);
//# sourceMappingURL=checkIn.model.js.map