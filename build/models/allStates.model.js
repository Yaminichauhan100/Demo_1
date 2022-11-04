"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const allStateSchema = new mongoose_1.Schema({
    "id": { type: mongoose_1.SchemaTypes.Number },
    "name": { type: mongoose_1.SchemaTypes.String },
    "country_id": { type: mongoose_1.SchemaTypes.Number },
    "country_code": { type: mongoose_1.SchemaTypes.String },
    "state_code": { type: mongoose_1.SchemaTypes.String },
    "tax": { type: mongoose_1.SchemaTypes.Number }
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.ALLStates,
    timestamps: true
});
exports.default = mongoose_1.model(common_1.ENUM.COL.ALLStates, allStateSchema);
//# sourceMappingURL=allStates.model.js.map