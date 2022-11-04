"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminTaxesController = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const _builders_1 = __importDefault(require("@builders"));
const _baseController_1 = __importDefault(require("@baseController"));
const mongoose_1 = require("mongoose");
const _common_1 = require("@common");
const _entity_1 = require("@entity");
let AdminTaxesClass = class AdminTaxesClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async setTaxes(req, res, next) {
        try {
            let payload = req.body;
            switch (payload.level) {
                case _common_1.CONSTANT.ADMIN_TAXES_LEVEL.COUNTRY:
                    await Promise.all([
                        _entity_1.CountriesV1.updateDocument({ "id": payload.countryId }, { tax: payload.tax }),
                        _entity_1.PropertyV1.updateEntity({ "country.id": payload.countryId }, { "country.tax": payload.tax }, { multi: true }),
                        _entity_1.PropertyV1.removeMultipleFields({ "country.id": payload.countryId }, {
                            $unset: {
                                "state.tax": ""
                            }
                        }, { multi: true }),
                        _entity_1.StatesV1.removeMultipleFields({ "country_id": payload.countryId }, {
                            $unset: {
                                "tax": ""
                            }
                        }, { multi: true })
                    ]);
                    break;
                case _common_1.CONSTANT.ADMIN_TAXES_LEVEL.STATE:
                    let promiseData = [];
                    for (let i = 0; i < payload.state.length; i++) {
                        promiseData.push(_entity_1.StatesV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.state[i].id) }, { tax: payload.state[i].tax }));
                        promiseData.push(_entity_1.AllStatesV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.state[i].id) }, { tax: payload.state[i].tax }));
                        promiseData.push(_entity_1.PropertyV1.updateEntity({ "state._id": payload.state[i].id }, { "state.tax": payload.state[i].tax }, { multi: true }));
                    }
                    await Promise.all(promiseData);
                    break;
            }
            return this.sendResponse(res, _common_1.RESPONSE.ADMIN(res.locals.lang).TAXES_UPDATED);
        }
        catch (err) {
            next(err);
        }
    }
    async getDetails(req, res, next) {
        try {
            let payload = req.params;
            let response;
            switch (payload.type) {
                case _common_1.CONSTANT.ADMIN_TAXES_LEVEL.COUNTRY:
                    response = await _entity_1.CountriesV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.id) });
                    break;
                case _common_1.CONSTANT.ADMIN_TAXES_LEVEL.STATE:
                    response = await _entity_1.StatesV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.id) });
                    break;
            }
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            next(err);
        }
    }
    async getCountries(req, res, next) {
        try {
            let payload = req.query;
            payload.getCount = true;
            let pipeline = _builders_1.default.Admin.Location.countryListingForTaxes(req.query);
            let data = await _entity_1.CountriesV1.paginateAggregate(pipeline, payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, data);
        }
        catch (err) {
            next(err);
        }
    }
    async getStates(req, res, next) {
        try {
            let payload = req.params;
            let pipeline = _builders_1.default.Admin.Location.stateListingForTaxes(payload.countryId);
            let data = await _entity_1.CountriesV1.basicAggregate(pipeline);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, data);
        }
        catch (err) {
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Add taxes",
        path: '/',
        parameters: {
            body: {
                description: 'Body for adding taxes',
                required: true,
                model: 'ReqAdminAddTaxesModel'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AdminTaxesClass.prototype, "setTaxes", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Property listing",
        path: '/details/:id/:type',
        parameters: {
            path: {
                id: {
                    description: 'mongoId',
                    required: true,
                },
                type: {
                    description: 'level type enum',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AdminTaxesClass.prototype, "getDetails", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Property listing",
        path: '/getCountries',
        parameters: {
            query: {
                page: {
                    description: 'pagination => 1',
                    required: true,
                },
                limit: {
                    description: 'limit => 10',
                    required: true,
                },
                search: {
                    description: 'search by country name',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AdminTaxesClass.prototype, "getCountries", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Property listing",
        path: '/getStates/:countryId',
        parameters: {
            path: {
                countryId: {
                    description: 'countryId => 101',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AdminTaxesClass.prototype, "getStates", null);
AdminTaxesClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/admins/taxes",
        name: "Admin Taxes Module",
        security: { apiKeyHeader: [] },
    }),
    __metadata("design:paramtypes", [])
], AdminTaxesClass);
exports.AdminTaxesController = new AdminTaxesClass();
//# sourceMappingURL=admin.taxes.controller.js.map