"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const adminMetaSchema = {
    "lastLogin": { type: mongoose_1.SchemaTypes.Date },
    "token": {
        "time": { type: mongoose_1.SchemaTypes.Date },
        "value": { type: mongoose_1.SchemaTypes.String, trim: true }
    }
};
const adminSchema = new mongoose_1.Schema({
    "adminMeta": adminMetaSchema,
    "email": { type: mongoose_1.SchemaTypes.String, required: true, index: true },
    "isActive": { type: mongoose_1.SchemaTypes.Boolean, default: true },
    "isDelete": { type: mongoose_1.SchemaTypes.Boolean, default: false },
    "name": { type: mongoose_1.SchemaTypes.String, trim: true },
    "password": { type: mongoose_1.SchemaTypes.String },
    "profilePhoto": { type: mongoose_1.SchemaTypes.String },
    "role": { type: mongoose_1.SchemaTypes.String, default: common_1.ENUM.ADMIN.TYPE.SUPER_ADMIN },
    "salt": { type: mongoose_1.SchemaTypes.String, required: true }
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.ADMIN,
    timestamps: true
});
exports.default = mongoose_1.model(common_1.ENUM.COL.ADMIN, adminSchema);
//# sourceMappingURL=admin.model.js.map