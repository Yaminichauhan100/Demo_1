"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const statesSchema = new mongoose_1.Schema({
    "id": { type: mongoose_1.SchemaTypes.Number },
    "name": { type: mongoose_1.SchemaTypes.String },
    "country_id": { type: mongoose_1.SchemaTypes.Number },
    "isDelete": { type: mongoose_1.SchemaTypes.Boolean, default: false },
    "tax": { type: mongoose_1.SchemaTypes.Number }
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.STATES,
    timestamps: true
});
statesSchema.index({ "country_id": 1 });
statesSchema.index({ "name": 1 });
exports.default = mongoose_1.model(common_1.ENUM.COL.STATES, statesSchema);
//# sourceMappingURL=states.model.js.map