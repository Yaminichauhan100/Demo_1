"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const configSchema = new mongoose_1.Schema({
    data: { type: mongoose_1.Schema.Types.Mixed },
    type: { type: mongoose_1.Schema.Types.Number, enum: [common_1.ENUM_ARRAY.CONFIG_TYPE.ADMOUNT, common_1.ENUM_ARRAY.CONFIG_TYPE.PARTNER_TYPE] },
    isDeleted: { type: mongoose_1.Schema.Types.Boolean, default: false },
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.CONFIG,
    timestamps: true
});
exports.default = mongoose_1.model(common_1.ENUM.COL.CONFIG, configSchema);
//# sourceMappingURL=config.model.js.map