"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const countriesSchema = new mongoose_1.Schema({
    "id": { type: mongoose_1.SchemaTypes.Number },
    "sortname": { type: mongoose_1.SchemaTypes.String },
    "name": { type: mongoose_1.SchemaTypes.String },
    "phoneCode": { type: mongoose_1.SchemaTypes.Number },
    "isDelete": { type: mongoose_1.SchemaTypes.Boolean, default: false },
    "tax": { type: mongoose_1.SchemaTypes.Number }
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.COUNTRIES,
    timestamps: true
});
exports.default = mongoose_1.model(common_1.ENUM.COL.COUNTRIES, countriesSchema);
//# sourceMappingURL=countries.model.js.map