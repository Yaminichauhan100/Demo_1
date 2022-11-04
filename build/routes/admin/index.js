"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const common_admin_routes_1 = __importDefault(require("./common.admin.routes"));
const admin_routes_1 = __importDefault(require("./admin.routes"));
const admin_user_routes_1 = __importDefault(require("./admin.user.routes"));
const admin_host_routes_1 = __importDefault(require("./admin.host.routes"));
const admin_amenities_routes_1 = __importDefault(require("./admin.amenities.routes"));
const admin_category_routes_1 = __importDefault(require("./admin.category.routes"));
const admin_location_routes_1 = __importDefault(require("./admin.location.routes."));
const admin_property_routes_1 = __importDefault(require("./admin.property.routes"));
const admin_booking_routes_1 = __importDefault(require("./admin.booking.routes"));
const admin_faqs_routes_1 = __importDefault(require("./admin.faqs.routes"));
const admin_subject_routes_1 = __importDefault(require("./admin.subject.routes"));
const admin_rating_route_1 = __importDefault(require("./admin.rating.route"));
const admin_cancellation_policy_routes_1 = __importDefault(require("./admin.cancellation.policy.routes"));
const admin_payment_routes_1 = __importDefault(require("./admin.payment.routes"));
const admin_notification_routes_1 = __importDefault(require("./admin.notification.routes"));
const admin_payout_routes_1 = __importDefault(require("./admin.payout.routes"));
const admin_giftcard_route_1 = __importDefault(require("./admin.giftcard.route"));
const admin_partner_route_1 = __importDefault(require("./admin.partner.route"));
const admin_advprice_routes_1 = __importDefault(require("./admin.advprice.routes"));
const admin_property_claim_route_1 = __importDefault(require("./admin.property.claim.route"));
const admin_commission_routes_1 = __importDefault(require("./admin.commission.routes"));
const admin_taxes_routes_1 = __importDefault(require("./admin.taxes.routes"));
const util_1 = require("../../services/utils/util");
class AdminRoutes extends _baseRoute_1.default {
    constructor() {
        super();
        this.path = '/admins';
        this.init();
    }
    get instance() {
        return this.router;
    }
    routeMiddlewares() {
        this.router.use('/', (req, res, next) => {
            util_1.logger(`\n========================= NEW REQUEST ===> ${req.method} ${req.originalUrl}`);
            util_1.logger(req.body);
            util_1.logger(`\n=========================`);
            res.locals.lang = req.headers.lang || 'en';
            next();
        });
    }
    init() {
        this.routeMiddlewares();
        this.router.use(common_admin_routes_1.default.path, common_admin_routes_1.default.instance);
        this.router.use(admin_routes_1.default.path, admin_routes_1.default.instance);
        this.router.use(admin_user_routes_1.default.path, admin_user_routes_1.default.instance);
        this.router.use(admin_host_routes_1.default.path, admin_host_routes_1.default.instance);
        this.router.use(admin_amenities_routes_1.default.path, admin_amenities_routes_1.default.instance);
        this.router.use(admin_category_routes_1.default.path, admin_category_routes_1.default.instance);
        this.router.use(admin_location_routes_1.default.path, admin_location_routes_1.default.instance);
        this.router.use(admin_property_routes_1.default.path, admin_property_routes_1.default.instance);
        this.router.use(admin_booking_routes_1.default.path, admin_booking_routes_1.default.instance);
        this.router.use(admin_faqs_routes_1.default.path, admin_faqs_routes_1.default.instance);
        this.router.use(admin_subject_routes_1.default.path, admin_subject_routes_1.default.instance);
        this.router.use(admin_rating_route_1.default.path, admin_rating_route_1.default.instance);
        this.router.use(admin_cancellation_policy_routes_1.default.path, admin_cancellation_policy_routes_1.default.instance);
        this.router.use(admin_payment_routes_1.default.path, admin_payment_routes_1.default.instance);
        this.router.use(admin_payout_routes_1.default.path, admin_payout_routes_1.default.instance);
        this.router.use(admin_notification_routes_1.default.path, admin_notification_routes_1.default.instance);
        this.router.use(admin_giftcard_route_1.default.path, admin_giftcard_route_1.default.instance);
        this.router.use(admin_partner_route_1.default.path, admin_partner_route_1.default.instance);
        this.router.use(admin_advprice_routes_1.default.path, admin_advprice_routes_1.default.instance);
        this.router.use(admin_property_claim_route_1.default.path, admin_property_claim_route_1.default.instance);
        this.router.use(admin_commission_routes_1.default.path, admin_commission_routes_1.default.instance);
        this.router.use(admin_taxes_routes_1.default.path, admin_taxes_routes_1.default.instance);
    }
}
exports.default = new AdminRoutes();
//# sourceMappingURL=index.js.map