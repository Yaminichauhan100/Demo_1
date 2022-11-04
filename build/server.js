"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const app_1 = __importDefault(require("./app"));
let server = app_1.default.instance.listen(common_1.CONFIG.APP_PORT);
server.on('listening', function () {
    console.info(`Server started listening on port ${common_1.CONFIG.APP_PORT}`);
});
//# sourceMappingURL=server.js.map