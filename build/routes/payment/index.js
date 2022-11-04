"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const payment_route_1 = __importDefault(require("./payment.route"));
const util_1 = require("../../services/utils/util");
class v1AppRoutes extends _baseRoute_1.default {
    constructor() {
        super();
        this.path = '/payment';
        this.init();
    }
    get instance() {
        return this.router;
    }
    routeMiddlewares() {
        this.router.use('/', (req, res, next) => {
            util_1.logger(`\n========================= NEW REQUEST -> ${req.method} ${req.originalUrl}`);
            util_1.logger(`=========================req.body`, req.body);
            util_1.logger(`=========================req.headers`, req.headers);
            util_1.logger(`=========================req.params`, req.param);
            util_1.logger(`\n=========================`);
            res.locals.lang = req.headers.lang || 'en';
            next();
        });
    }
    init() {
        this.routeMiddlewares();
        this.router.use(payment_route_1.default.path, payment_route_1.default.instance);
    }
}
exports.default = new v1AppRoutes();
//# sourceMappingURL=index.js.map