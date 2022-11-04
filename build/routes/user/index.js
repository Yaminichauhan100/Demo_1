"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const user_routes_1 = __importDefault(require("./user.routes"));
const user_property_routes_1 = __importDefault(require("./user.property.routes"));
const user_payment_routes_1 = __importDefault(require("./user.payment.routes"));
const user_giftcard_routes_1 = __importDefault(require("./user.giftcard.routes"));
const user_coworker_routes_1 = __importDefault(require("./user.coworker.routes"));
const user_notification_routes_1 = __importDefault(require("./user.notification.routes"));
const user_rating_route_1 = __importDefault(require("./user.rating.route"));
const user_contact_routes_1 = __importDefault(require("./user.contact.routes"));
const user_cancellation_policy_routes_1 = __importDefault(require("./user.cancellation.policy.routes"));
const user_employee_routes_1 = __importDefault(require("./user.employee.routes"));
const util_1 = require("../../services/utils/util");
class v1AppRoutes extends _baseRoute_1.default {
    constructor() {
        super();
        this.path = '/user';
        this.init();
    }
    get instance() {
        return this.router;
    }
    routeMiddlewares() {
        this.router.use('/', (req, res, next) => {
            util_1.logger(`=========================>req.body`, req.body);
            res.locals.lang = req.headers.lang || 'en';
            util_1.logger(`=========================>req.headers`, req.headers);
            next();
        });
    }
    init() {
        this.routeMiddlewares();
        this.router.use(user_routes_1.default.path, user_routes_1.default.instance);
        this.router.use(user_property_routes_1.default.path, user_property_routes_1.default.instance);
        this.router.use(user_payment_routes_1.default.path, user_payment_routes_1.default.instance);
        this.router.use(user_coworker_routes_1.default.path, user_coworker_routes_1.default.instance);
        this.router.use(user_notification_routes_1.default.path, user_notification_routes_1.default.instance);
        this.router.use(user_rating_route_1.default.path, user_rating_route_1.default.instance);
        this.router.use(user_contact_routes_1.default.path, user_contact_routes_1.default.instance);
        this.router.use(user_cancellation_policy_routes_1.default.path, user_cancellation_policy_routes_1.default.instance);
        this.router.use(user_giftcard_routes_1.default.path, user_giftcard_routes_1.default.instance);
        this.router.use(user_employee_routes_1.default.path, user_employee_routes_1.default.instance);
    }
}
exports.default = new v1AppRoutes();
//# sourceMappingURL=index.js.map