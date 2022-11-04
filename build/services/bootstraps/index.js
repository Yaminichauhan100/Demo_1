"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrapStatus = exports.bootStrap = void 0;
require("module-alias/register");
const _services_1 = require("@services");
if (!process.env.NODE_ENV) {
    console.error("ERROR: No Node Environment defined");
    process.exit(100);
}
const helper_service_1 = require("../helper.service");
const Seeder = __importStar(require("./seeder.bootstrap"));
const _common_1 = require("@common");
exports.bootStrap = async () => {
    try {
        if (process.env.NODE_ENV === 'prod') {
            await _services_1.subscribe(`__keyevent@0__:expired`);
        }
        else {
            await _services_1.subscribe(`__keyevent@${_common_1.CONFIG.REDIS_INDEX}__:expired`);
        }
        await _services_1.rabbitMQ.createConnection();
    }
    catch (error) {
        console.error(`we have an error in bootstrap`, error);
        throw error;
    }
};
exports.bootstrapStatus = {
    createDirectory: helper_service_1.Helper.createNewDirectory('bin'),
    environmentCheck: helper_service_1.Helper.checkFileExists(`bin/.env.${process.env.NODE_ENV}`),
    createAdmin: Seeder.createAdmin([
        { name: 'Admin', email: "desknowadmin@yopmail.com" },
    ])
};
console.log('~~~ Initiating Bootstrapping ~~~\n');
console.log(`1. Create Required Directories: ${exports.bootstrapStatus.createDirectory ? '✔' : '❌'}`);
console.log(`2. Environment File Exists: ${exports.bootstrapStatus.environmentCheck ? '✔' : '❌'}`);
console.log(`3. Admin Exists: ${exports.bootstrapStatus.createAdmin ? '✔' : '❌'}`);
console.log('\n~~~ Completed Bootstrapping ~~~\n');
//# sourceMappingURL=index.js.map