"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoDOA = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("../../common");
class Mongo {
    constructor() { }
    async connectDatabase(uri) {
        try {
            console.log(`mongo uri`, uri);
            await mongoose_1.default.connect(uri, {
                useCreateIndex: true,
                useUnifiedTopology: true,
                useNewUrlParser: true,
                poolSize: common_1.CONFIG.DB_POOLSIZE,
            });
            console.log(`SUCCESS: database connected to "${uri}`);
            mongoose_1.default.set('debug', true);
        }
        catch (error) {
            console.error(`Error in connecting to mongo ==> ${error}`);
            process.exit(common_1.SYS_ERR.MONGO_CONN_FAILED);
        }
    }
}
exports.mongoDOA = new Mongo();
//# sourceMappingURL=mongo.database.js.map