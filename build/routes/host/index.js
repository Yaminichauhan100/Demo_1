"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const host_routes_1 = __importDefault(require("./host.routes"));
const host_properties_route_1 = __importDefault(require("./host.properties.route"));
const host_notification_routes_1 = __importDefault(require("./host.notification.routes"));
const host_rating_routes_1 = __importDefault(require("./host.rating.routes"));
const host_offline_booking_routes_1 = __importDefault(require("./host.offline.booking.routes"));
const host_contact_routes_1 = __importDefault(require("./host.contact.routes"));
const host_cohost_routes_1 = __importDefault(require("./host.cohost.routes"));
const host_dashboard_routes_1 = __importDefault(require("./host.dashboard.routes"));
const host_check_in_route_1 = __importDefault(require("../host/host.check_in.route"));
const host_cancellation_policy_routes_1 = __importDefault(require("./host.cancellation.policy.routes"));
const host_promotions_routes_1 = __importDefault(require("./host.promotions.routes"));
const host_partner_route_1 = __importDefault(require("./host.partner.route"));
const util_1 = require("../../services/utils/util");
class v1AppRoutes extends _baseRoute_1.default {
    constructor() {
        super();
        this.path = '/host';
        this.init();
    }
    get instance() {
        return this.router;
    }
    routeMiddlewares() {
        this.router.use('/', (req, res, next) => {
            util_1.logger(`\n========================= NEW REQUEST -> ${req.method} ${req.originalUrl}`);
            util_1.logger(req.body);
            util_1.logger(`\n=========================`);
            res.locals.lang = req.headers.lang || 'en';
            next();
        });
    }
    init() {
        this.routeMiddlewares();
        this.router.use(host_routes_1.default.path, host_routes_1.default.instance);
        this.router.use(host_properties_route_1.default.path, host_properties_route_1.default.instance);
        this.router.use(host_notification_routes_1.default.path, host_notification_routes_1.default.instance);
        this.router.use(host_rating_routes_1.default.path, host_rating_routes_1.default.instance);
        this.router.use(host_offline_booking_routes_1.default.path, host_offline_booking_routes_1.default.instance);
        this.router.use(host_contact_routes_1.default.path, host_contact_routes_1.default.instance);
        this.router.use(host_cohost_routes_1.default.path, host_cohost_routes_1.default.instance);
        this.router.use(host_dashboard_routes_1.default.path, host_dashboard_routes_1.default.instance);
        this.router.use(host_check_in_route_1.default.path, host_check_in_route_1.default.instance);
        this.router.use(host_cancellation_policy_routes_1.default.path, host_cancellation_policy_routes_1.default.instance);
        this.router.use(host_promotions_routes_1.default.path, host_promotions_routes_1.default.instance);
        this.router.use(host_partner_route_1.default.path, host_partner_route_1.default.instance);
    }
}
exports.default = new v1AppRoutes();
//# sourceMappingURL=index.js.map