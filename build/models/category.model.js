"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const categorySchema = new mongoose_1.Schema({
    parentId: { type: mongoose_1.Schema.Types.ObjectId },
    name: { type: mongoose_1.SchemaTypes.String },
    description: { type: mongoose_1.SchemaTypes.String },
    iconImage: { type: mongoose_1.SchemaTypes.String },
    options: { type: [mongoose_1.SchemaTypes.String] },
    status: {
        type: mongoose_1.SchemaTypes.String,
        enum: [
            common_1.ENUM.CATEGORY.STATUS.ACTIVE,
            common_1.ENUM.CATEGORY.STATUS.INACTIVE,
            common_1.ENUM.CATEGORY.STATUS.DELETE
        ], default: common_1.ENUM.CATEGORY.STATUS.ACTIVE
    },
    colorCode: { type: mongoose_1.SchemaTypes.String }
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.CATEGORY,
    timestamps: true
});
categorySchema.index({ parentId: 1, status: 1 });
categorySchema.index({ status: 1, name: 1 });
exports.default = mongoose_1.model(common_1.ENUM.COL.CATEGORY, categorySchema);
//# sourceMappingURL=category.model.js.map