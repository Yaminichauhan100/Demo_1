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
exports.AdminAmenitiesController = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const _baseController_1 = __importDefault(require("@baseController"));
const _builders_1 = __importDefault(require("@builders"));
const _entity_1 = require("@entity");
const _common_1 = require("@common");
const _services_1 = require("@services");
let AdminAmenitiesClass = class AdminAmenitiesClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async getAmenities(req, res, next) {
        try {
            let payload = req.query;
            let pipeline = await _builders_1.default.Admin.Amenities.AmenitiesList(payload);
            payload.getCount = true;
            let usersList = await _entity_1.AmenitiesV1.paginateAggregate(pipeline, payload);
            this.sendResponse(res, _common_1.SUCCESS.DEFAULT, usersList);
        }
        catch (err) {
            next(err);
        }
    }
    async addAmenities(req, res, next) {
        try {
            let payload = req.body;
            let checkDupilcateAmenties = await _entity_1.AmenitiesV1.checkDuplicateAmenities(payload.name);
            if (checkDupilcateAmenties && checkDupilcateAmenties.length > 0)
                return this.sendResponse(res, _common_1.RESPONSE.AMENITIES(res.locals.lang).DUPLICATE_AMENITIES);
            await _entity_1.AmenitiesV1.createAmenities(payload);
            let amentitiesDetails = await await _entity_1.AmenitiesV1.getAmenitiesList();
            if (amentitiesDetails && amentitiesDetails.length > 0)
                _services_1.redisDOA.insertKeyInRedisHash(_common_1.DATABASE.REDIS.KEY_NAMES.CATEGORY_AMENITIES, _common_1.DATABASE.REDIS.KEY_NAMES.AMENITIES_HASH, JSON.stringify(amentitiesDetails));
            return this.sendResponse(res, _common_1.RESPONSE.AMENITIES(res.locals.lang).AMENITIES_CREATED);
        }
        catch (err) {
            console.error("Error", err);
            next(err);
        }
    }
    async updateAmenities(req, res, next) {
        try {
            let payload = req.body;
            let amenities = await _entity_1.AmenitiesV1.findOne({ _id: payload.id });
            if (!amenities)
                return this.sendResponse(res, _common_1.RESPONSE.AMENITIES(res.locals.lang).NOT_FOUND);
            if (amenities['name'] != payload.name && amenities['name'].toLowerCase != payload.name.toLowerCase) {
                const checkDuplicateAmenities = await _entity_1.AmenitiesV1.checkDuplicateAmenities(payload.name);
                if (checkDuplicateAmenities && checkDuplicateAmenities.length > 0)
                    return this.sendResponse(res, _common_1.RESPONSE.AMENITIES(res.locals.lang).DUPLICATE_AMENITIES);
            }
            await Promise.all([
                _entity_1.AmenitiesV1.updateDocument({ _id: payload.id }, { 'name': payload.name, 'type': payload.type, 'iconImage': payload.iconImage }),
                _entity_1.PropertyV1.updateEntityWithoutIsDelete({ amenities: { $elemMatch: { "amenityId": payload.id, "status": _common_1.ENUM.AMENITIES.STATUS.ACTIVE } } }, { 'amenities.$.name': payload.name, 'amenities.$.iconImage': payload.iconImage, 'amenities.$.type': payload.type }, { multi: true }),
            ]);
            let amentitiesDetails = await _entity_1.AmenitiesV1.getAmenitiesList();
            if (amentitiesDetails && amentitiesDetails.length > 0)
                _services_1.redisDOA.insertKeyInRedisHash(_common_1.DATABASE.REDIS.KEY_NAMES.CATEGORY_AMENITIES, _common_1.DATABASE.REDIS.KEY_NAMES.AMENITIES_HASH, JSON.stringify(amentitiesDetails));
            return this.sendResponse(res, _common_1.RESPONSE.AMENITIES(res.locals.lang).AMENITIES_UPDATED);
        }
        catch (err) {
            console.error("Error", err);
            next(err);
        }
    }
    async inActivate(req, res, next) {
        try {
            let amenities = await _entity_1.AmenitiesV1.findOne({ _id: req.params.id });
            if (amenities) {
                if (amenities.status != _common_1.ENUM.AMENITIES.STATUS.INACTIVE) {
                    let dataToSet = { "amenities.$.status": _common_1.ENUM.AMENITIES.STATUS.INACTIVE };
                    await Promise.all([
                        _entity_1.PropertyV1.updateEntityWithoutIsDelete({ amenities: { $elemMatch: { "amenityId": req.params.id, "status": _common_1.ENUM.AMENITIES.STATUS.ACTIVE } } }, dataToSet, { multi: true }),
                        _entity_1.AmenitiesV1.updateDocument({ _id: amenities._id }, { status: _common_1.ENUM.AMENITIES.STATUS.INACTIVE })
                    ]);
                    return this.sendResponse(res, _common_1.RESPONSE.AMENITIES(res.locals.lang).DE_ACTIVATED);
                }
                else
                    return this.sendResponse(res, _common_1.RESPONSE.AMENITIES(res.locals.lang).ALREADY_DE_ACTIVE);
            }
            else
                return this.sendResponse(res, _common_1.RESPONSE.AMENITIES(res.locals.lang).NOT_FOUND);
        }
        catch (err) {
            next(err);
        }
    }
    async activate(req, res, next) {
        try {
            let amenities = await _entity_1.AmenitiesV1.findOne({ _id: req.params.id });
            if (amenities) {
                if (amenities.status != _common_1.ENUM.AMENITIES.STATUS.ACTIVE) {
                    let dataToSet = { "amenities.$.status": _common_1.ENUM.AMENITIES.STATUS.ACTIVE };
                    await Promise.all([
                        _entity_1.PropertyV1.updateEntityWithoutIsDelete({ amenities: { $elemMatch: { "amenityId": req.params.id, "status": _common_1.ENUM.AMENITIES.STATUS.INACTIVE } } }, dataToSet, { multi: true }),
                        _entity_1.AmenitiesV1.updateDocument({ _id: amenities._id }, { status: _common_1.ENUM.AMENITIES.STATUS.ACTIVE })
                    ]);
                    return this.sendResponse(res, _common_1.RESPONSE.AMENITIES(res.locals.lang).ACTIVATED);
                }
                else
                    return this.sendResponse(res, _common_1.RESPONSE.AMENITIES(res.locals.lang).ALREADY_ACTIVE);
            }
            else
                return this.sendResponse(res, _common_1.RESPONSE.AMENITIES(res.locals.lang).NOT_FOUND);
        }
        catch (err) {
            next(err);
        }
    }
    async details(req, res, next) {
        try {
            let payload = req.params;
            let pipeline = _builders_1.default.Admin.Amenities.AmenitiesDeatils(payload.id);
            let details = await _entity_1.AmenitiesV1.basicAggregate(pipeline);
            if (details)
                return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, details);
            else
                return this.sendResponse(res, _common_1.RESPONSE.AMENITIES(res.locals.lang).NOT_FOUND);
        }
        catch (err) {
            next(err);
        }
    }
    async updateAmenitiesFeatureStatus(req, res, next) {
        try {
            let payload = req.body;
            let amenities = await _entity_1.AmenitiesV1.findOne({ _id: payload.id });
            if (!amenities)
                return this.sendResponse(res, _common_1.RESPONSE.AMENITIES(res.locals.lang).NOT_FOUND);
            if ((payload === null || payload === void 0 ? void 0 : payload.isFeatured) === 1) {
                let featuredAmentiesCount = await _entity_1.AmenitiesV1.count({ isFeatured: 1, "status": "active", });
                if (featuredAmentiesCount && featuredAmentiesCount >= 3)
                    return this.sendResponse(res, _common_1.RESPONSE.AMENITIES(res.locals.lang).Featured_AMENITIES_LIMIT);
            }
            await Promise.all([
                _entity_1.AmenitiesV1.updateDocument({ _id: payload.id }, { isFeatured: payload.isFeatured }),
                _entity_1.PropertyV1.updateEntityWithoutIsDelete({ amenities: { $elemMatch: { "amenityId": payload.id, } } }, { 'amenities.$.name': amenities.name, 'amenities.$.iconImage': amenities.iconImage, 'amenities.$.type': amenities.type, 'amenities.$.isFeatured': payload.isFeatured }, { multi: true }),
            ]);
            let amentitiesDetails = await _entity_1.AmenitiesV1.getAmenitiesList();
            if (amentitiesDetails && amentitiesDetails.length > 0)
                _services_1.redisDOA.insertKeyInRedisHash(_common_1.DATABASE.REDIS.KEY_NAMES.CATEGORY_AMENITIES, _common_1.DATABASE.REDIS.KEY_NAMES.AMENITIES_HASH, JSON.stringify(amentitiesDetails));
            return this.sendResponse(res, _common_1.RESPONSE.AMENITIES(res.locals.lang).AMENITIES_UPDATED);
        }
        catch (err) {
            console.error("Error", err);
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Amenities listing",
        path: '/list',
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
                type: {
                    description: 'type',
                    required: false,
                },
                status: {
                    description: 'active/inactive',
                    required: false,
                },
                sortKey: {
                    description: 'name/createdAt',
                    required: false,
                },
                sortOrder: {
                    description: '-1/1',
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
], AdminAmenitiesClass.prototype, "getAmenities", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Add Amenities",
        path: '/add',
        parameters: {
            body: {
                description: 'Body for add amenities',
                required: true,
                model: 'ReqAddAmenities'
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
], AdminAmenitiesClass.prototype, "addAmenities", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Update Amenities",
        path: '/update',
        parameters: {
            body: {
                description: 'Body for add amenities',
                required: true,
                model: 'ReqUpdateAmenities'
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
], AdminAmenitiesClass.prototype, "updateAmenities", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Inactive",
        path: '/{id}/inactive',
        parameters: {
            path: {
                id: {
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
], AdminAmenitiesClass.prototype, "inActivate", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Activate amenities",
        path: '/{id}/active',
        parameters: {
            path: {
                id: {
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
], AdminAmenitiesClass.prototype, "activate", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "User Details",
        path: '/{id}/details',
        parameters: {
            path: {
                id: {
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
], AdminAmenitiesClass.prototype, "details", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Update Amenities Featured status",
        path: '/isFeatured',
        parameters: {
            body: {
                description: 'Body for add faetures amenities',
                required: true,
                model: 'ReqUpdateAmenitiesFeatureModel'
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
], AdminAmenitiesClass.prototype, "updateAmenitiesFeatureStatus", null);
AdminAmenitiesClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/admins/amenities",
        name: "Admin Amenities Module",
        security: { apiKeyHeader: [] },
    }),
    __metadata("design:paramtypes", [])
], AdminAmenitiesClass);
exports.AdminAmenitiesController = new AdminAmenitiesClass();
//# sourceMappingURL=admin.amenities.controller.js.map