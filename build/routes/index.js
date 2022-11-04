"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./user/index"));
const base_routes_1 = __importDefault(require("./base.routes"));
const index_2 = __importDefault(require("./admin/index"));
const index_3 = __importDefault(require("./host/index"));
const index_4 = __importDefault(require("./payment/index"));
const user_employee_routes_1 = __importDefault(require("./user/user.employee.routes"));
const util_1 = require("../services/utils/util");
class Routes extends base_routes_1.default {
    constructor() {
        super();
        this.path = '/api';
        this.init();
    }
    get instance() {
        return this.router;
    }
    routeMiddlewares() {
        this.router.use('/', (req, res, next) => {
            util_1.logger(`=========================>req?.query`, req.query);
            util_1.logger(`=========================>req?.body`, req.body);
            res.locals.lang = req.headers.lang || 'en';
            util_1.logger(`=========================>req?.headers`, req.headers);
            next();
        });
    }
    init() {
        this.routeMiddlewares();
        this.router.use(index_1.default.path, index_1.default.instance);
        this.router.use(index_2.default.path, index_2.default.instance);
        this.router.use(index_3.default.path, index_3.default.instance);
        this.router.use(index_4.default.path, index_4.default.instance);
        this.router.use(user_employee_routes_1.default.path, user_employee_routes_1.default.instance);
    }
}
exports.default = new Routes();
//# sourceMappingURL=index.js.map