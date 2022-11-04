"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const logsSchema = new mongoose_1.Schema({
    type: {
        type: mongoose_1.Schema.Types.Number, enum: [
            common_1.ENUM.COMMON_LOGS_TYPE.PROPERTY_CRON
        ]
    },
    data: { type: mongoose_1.Schema.Types.Mixed }
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.LOGS,
    timestamps: true
});
logsSchema.index({ "createdAt": 1 }, { expireAfterSeconds: 180 });
exports.default = mongoose_1.model(common_1.ENUM.COL.LOGS, logsSchema);
//# sourceMappingURL=logs.model.js.map