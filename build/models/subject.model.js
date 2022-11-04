"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const subjectSchema = new mongoose_1.Schema({
    name: { type: mongoose_1.SchemaTypes.String },
    type: {
        type: mongoose_1.SchemaTypes.Number,
        enum: common_1.ENUM_ARRAY.ADMIN.SUBJECT,
        default: common_1.ENUM.ADMIN.SUBJECT_TYPE.PLATFORM_SPECIFIC
    },
    userType: {
        type: mongoose_1.SchemaTypes.Number,
        enum: common_1.ENUM_ARRAY.USER.TYPE
    },
    status: {
        type: mongoose_1.Schema.Types.String,
        enum: common_1.ENUM_ARRAY.USER.STATUS,
        default: common_1.ENUM.USER.STATUS.ACTIVE
    }
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.SUBJECT,
    timestamps: true
});
exports.default = mongoose_1.model(common_1.ENUM.COL.SUBJECT, subjectSchema);
//# sourceMappingURL=subject.model.js.map