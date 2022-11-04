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
exports.AdminLocationController = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const _baseController_1 = __importDefault(require("@baseController"));
const _builders_1 = __importDefault(require("@builders"));
const _entity_1 = require("@entity");
const _common_1 = require("@common");
const mongoose_1 = require("mongoose");
let AdminLocationClass = class AdminLocationClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async getCountries(req, res, next) {
        try {
            let pipeline = _builders_1.default.Admin.Location.countryListing();
            let data = await _entity_1.CountriesV1.basicAggregate(pipeline);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, data);
        }
        catch (err) {
            next(err);
        }
    }
    async getStates(req, res, next) {
        try {
            let payload = req.params;
            let pipeline = _builders_1.default.Admin.Location.stateListing(payload.countryId);
            let data = await _entity_1.StatesV1.basicAggregate(pipeline);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, data);
        }
        catch (err) {
            next(err);
        }
    }
    async addCity(req, res, next) {
        var _a, _b;
        try {
            let payload = req.body;
            payload['stateName'] = (_a = (await _entity_1.StatesV1.fetchStateNameByStateId(payload))) === null || _a === void 0 ? void 0 : _a.name;
            payload['countryName'] = (_b = (await _entity_1.CountriesV1.fetchCountryByCountryId(payload))) === null || _b === void 0 ? void 0 : _b.name;
            let cityId = await _entity_1.CityV1.createCity(payload);
            payload.cityId = cityId._id;
            await _entity_1.AllCityV1.createCityByAdmin(payload);
            this.sendResponse(res, _common_1.RESPONSE.LOCATION(res.locals.lang).CITY_CREATED);
        }
        catch (err) {
            console.error("Error", err);
            next(err);
        }
    }
    async updateCity(req, res, next) {
        try {
            let payload = req.body;
            let city = await _entity_1.CityV1.findOne({ _id: payload.id });
            if (city) {
                await Promise.all([
                    _entity_1.CityV1.updateDocument({ _id: payload.id }, {
                        'countryId': payload.countryId,
                        'stateId': payload.stateId,
                        'isFeatured': payload.isFeatured,
                        'zipCodes': payload.zipCodes,
                        'cityName': payload.cityName,
                        'iconImage': payload.iconImage,
                        countryName: city.countryName,
                        stateName: city.stateName,
                        status: _common_1.ENUM.CITY.STATUS.ACTIVE
                    }),
                    _entity_1.AllCityV1.updateDocument({ cityId: mongoose_1.Types.ObjectId(payload.id) }, {
                        name: payload.cityName,
                        state_id: payload.stateId,
                        country_id: payload.countryId,
                        iconImage: payload.iconImage,
                        cityId: payload.id
                    }),
                    _entity_1.PropertyV1.updateEntity({ "city._id": payload.id }, {
                        'city.cityName': payload.cityName,
                        'city.iconImage': payload.iconImage,
                        'city.isFeatured': payload.isFeatured
                    }, { multi: true })
                ]);
                this.sendResponse(res, _common_1.RESPONSE.LOCATION(res.locals.lang).CITY_UPDATED);
            }
            else
                this.sendResponse(res, _common_1.RESPONSE.LOCATION(res.locals.lang).NOT_FOUND);
        }
        catch (err) {
            console.error("Error", err);
            next(err);
        }
    }
    async cityList(req, res, next) {
        try {
            let payload = req.query;
            let pipeline = await _builders_1.default.Admin.Location.CityListing(payload);
            payload.getCount = true;
            let catList = await _entity_1.CityV1.paginateAggregate(pipeline, payload);
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, catList);
        }
        catch (err) {
            next(err);
        }
    }
    async cityDetails(req, res, next) {
        try {
            let payload = req.params;
            let pipeline = _builders_1.default.Admin.Location.cityDetails(payload.cityId);
            let details = await _entity_1.CityV1.basicAggregate(pipeline);
            if (details.length)
                return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, details);
            else
                return this.sendResponse(res, _common_1.RESPONSE.LOCATION(res.locals.lang).NOT_FOUND);
        }
        catch (err) {
            next(err);
        }
    }
    async inactiveCity(req, res, next) {
        try {
            let cat = await _entity_1.CityV1.findOne({ _id: req.params.cityId });
            if (cat) {
                if (cat.status != _common_1.ENUM.CITY.STATUS.INACTIVE) {
                    _entity_1.CityV1.updateDocument({ _id: cat._id }, { status: _common_1.ENUM.CITY.STATUS.INACTIVE });
                    return this.sendResponse(res, _common_1.RESPONSE.LOCATION(res.locals.lang).DE_ACTIVATED);
                }
                else
                    return this.sendResponse(res, _common_1.RESPONSE.LOCATION(res.locals.lang).ALREADY_DE_ACTIVE);
            }
            else
                return this.sendResponse(res, _common_1.RESPONSE.LOCATION(res.locals.lang).NOT_FOUND);
        }
        catch (err) {
            next(err);
        }
    }
    async activeCity(req, res, next) {
        try {
            let cat = await _entity_1.CityV1.findOne({ _id: req.params.cityId });
            if (cat) {
                if (cat.status != _common_1.ENUM.CITY.STATUS.ACTIVE) {
                    _entity_1.CityV1.updateDocument({ _id: cat._id }, { status: _common_1.ENUM.CITY.STATUS.ACTIVE });
                    return this.sendResponse(res, _common_1.RESPONSE.LOCATION(res.locals.lang).ACTIVATED);
                }
                else
                    return this.sendResponse(res, _common_1.RESPONSE.LOCATION(res.locals.lang).ALREADY_ACTIVE);
            }
            else
                return this.sendResponse(res, _common_1.RESPONSE.LOCATION(res.locals.lang).NOT_FOUND);
        }
        catch (err) {
            next(err);
        }
    }
    async cityListAccordingToState(req, res, next) {
        try {
            let state = await _entity_1.CityV1.findMany({ stateId: req.params.stateId, isDelete: false });
            if (!state)
                return this.sendResponse(res, _common_1.RESPONSE.LOCATION(res.locals.lang).NOT_FOUND);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, state);
        }
        catch (err) {
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get Countries",
        path: '/getCountries',
        parameters: {},
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
], AdminLocationClass.prototype, "getCountries", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get States",
        path: '/{countryId}/getStates',
        parameters: {
            path: {
                countryId: {
                    description: 'id',
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
], AdminLocationClass.prototype, "getStates", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Add city",
        path: '/addCity',
        parameters: {
            body: {
                description: 'Body to add city',
                required: true,
                model: 'ReqAddCity'
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
], AdminLocationClass.prototype, "addCity", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Update city",
        path: '/updateCity',
        parameters: {
            body: {
                description: 'Body to update city',
                required: true,
                model: 'ReqUpdateCity'
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
], AdminLocationClass.prototype, "updateCity", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Category listing",
        path: '/cityList',
        parameters: {
            query: {
                page: {
                    description: '1',
                    required: false,
                },
                limit: {
                    description: '10',
                    required: false,
                },
                search: {
                    description: 'searchkey',
                    required: false,
                },
                countryId: {
                    description: 'countryId',
                    required: false,
                },
                stateId: {
                    description: 'stateId',
                    required: false,
                },
                status: {
                    description: 'active/inactive',
                    required: false,
                },
                sortKey: {
                    description: 'cityName/createdAt',
                    required: false,
                },
                sortOrder: {
                    description: '1 and -1',
                    required: false,
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
], AdminLocationClass.prototype, "cityList", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "User Details",
        path: '/{cityId}/cityDetails',
        parameters: {
            path: {
                cityId: {
                    description: 'mongoId',
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
], AdminLocationClass.prototype, "cityDetails", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Inactive",
        path: '/{cityId}/inactiveCity',
        parameters: {
            path: {
                cityId: {
                    description: 'mongoId',
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
], AdminLocationClass.prototype, "inactiveCity", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Activate Category",
        path: '/{cityId}/activeCity',
        parameters: {
            path: {
                cityId: {
                    description: 'mongoId',
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
], AdminLocationClass.prototype, "activeCity", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Inactive",
        path: '/cityList/{stateId}',
        parameters: {
            path: {
                stateId: {
                    description: 'string id',
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
], AdminLocationClass.prototype, "cityListAccordingToState", null);
AdminLocationClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/admins/location",
        name: "Admin Location Module",
        security: { apiKeyHeader: [] },
    }),
    __metadata("design:paramtypes", [])
], AdminLocationClass);
exports.AdminLocationController = new AdminLocationClass();
//# sourceMappingURL=admin.location.controller.js.map