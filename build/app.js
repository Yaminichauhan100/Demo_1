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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggermodel = void 0;
require("module-alias/register");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const _routes_1 = __importDefault(require("@routes"));
const path_1 = __importDefault(require("path"));
const _common_1 = require("@common");
const _middlewares_1 = __importDefault(require("@middlewares"));
const _services_1 = require("@services");
const swagger = __importStar(require("swagger-express-ts"));
require("reflect-metadata");
const swagger_express_ts_1 = require("swagger-express-ts");
const bootstraps_1 = require("./services/bootstraps");
const swaggermodel = __importStar(require("./swaggermodels/"));
exports.swaggermodel = swaggermodel;
const commonRoutes = __importStar(require("./routes/common.routes"));
const msal = __importStar(require("@azure/msal-node"));
const express_session_1 = __importDefault(require("express-session"));
const hbs_1 = require("hbs");
const moment_1 = __importDefault(require("moment"));
class Application {
    constructor() {
        this.app = express_1.default();
        this.init();
    }
    get instance() {
        return this.app;
    }
    async init() {
        try {
            await _services_1.mongoDOA.connectDatabase(_common_1.CONFIG.DB_URI);
            await _services_1.redisDOA.connectRedisDB();
            bootstraps_1.bootstrapStatus.createAdmin;
            this.useMiddlewares();
            this.useRoutes();
            await bootstraps_1.bootStrap();
        }
        catch (error) {
            console.error(`we have an error initializing server ==> ${error}`);
        }
    }
    useMiddlewares() {
        this.app.locals.users = {};
        this.app.use(cors_1.default());
        const msalConfig = {
            auth: {
                clientId: _common_1.CONFIG.OUTLOOK.OAUTH_APP_ID,
                authority: _common_1.CONFIG.OUTLOOK.OAUTH_AUTHORITY,
                clientSecret: _common_1.CONFIG.OUTLOOK.OAUTH_APP_SECRET
            },
            system: {
                loggerOptions: {
                    loggerCallback(loglevel, message, containsPii) {
                        console.info(message);
                    },
                    piiLoggingEnabled: false,
                    logLevel: msal.LogLevel.Verbose,
                }
            }
        };
        this.app.locals.msalClient = new msal.ConfidentialClientApplication(msalConfig);
        this.app.use(express_session_1.default({
            secret: 'your_secret_value_here',
            resave: false,
            saveUninitialized: false,
            unset: 'destroy'
        }));
        this.app.use((req, res, next) => {
            var _a;
            if ((_a = req === null || req === void 0 ? void 0 : req.session) === null || _a === void 0 ? void 0 : _a.userId) {
                res.locals.user = this.app.locals.users[req.session.userId];
            }
            next();
        });
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: false }));
        this.app.use(helmet_1.default());
        this.app.use(helmet_1.default.frameguard({ action: 'SAMEORIGIN' }));
        this.app.use(morgan_1.default('dev'));
        hbs_1.registerHelper('eventDateTime', function (dateTime) {
            return moment_1.default(dateTime).format('M/D/YY h:mm A');
        });
        this.app.use(express_1.default.static(path_1.default.resolve('uploads')));
        let options = {
            dotfiles: "ignore",
            etag: true,
            extensions: ["htm", "html"],
            index: false,
            maxAge: "7d",
            redirect: false,
            setHeaders: function (res, path, stat) {
                res.set("x-timestamp", Date.now());
            }
        };
        this.app.use(express_1.default.static(`${process.cwd()}/public`, options));
        this.app.set('views', express_1.default.static(process.cwd() + '/views'));
        this.app.set('view engine', 'hbs');
        this.app.use('/api-docs/swagger', express_1.default.static('swagger'));
        this.app.use('/api-docs/swagger/assets', express_1.default.static('node_modules/swagger-ui-dist'));
        this.app.use(swagger.express({
            definition: {
                info: {
                    title: "Desk Now",
                    version: "1.0",
                },
                securityDefinitions: {
                    apiKeyHeader: {
                        type: swagger_express_ts_1.SwaggerDefinitionConstant.Security.Type.API_KEY,
                        in: swagger_express_ts_1.SwaggerDefinitionConstant.Security.In.HEADER,
                        name: "Authorization"
                    }
                },
                schemes: ['http', 'https']
            }
        }));
    }
    useRoutes() {
        this.app.use(commonRoutes.default.path, commonRoutes.default.instance);
        this.app.use(_routes_1.default.path, _routes_1.default.instance);
        this.app.use(_middlewares_1.default.InvalidRoute);
        this.app.use(_middlewares_1.default.ErrorHandler);
    }
}
exports.default = new Application();
//# sourceMappingURL=app.js.map