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
exports.AdminPropertyController = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const _baseController_1 = __importDefault(require("@baseController"));
const _builders_1 = __importDefault(require("@builders"));
const _entity_1 = require("@entity");
const _common_1 = require("@common");
const mongoose_1 = require("mongoose");
let AdminPropertyClass = class AdminPropertyClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async getProperty(req, res, next) {
        try {
            let payload = req.query;
            let pipeline = await _builders_1.default.Admin.Property.PropertyList(payload);
            payload.getCount = true;
            let catList = await _entity_1.PropertyV1.paginateAggregate(pipeline, payload);
            this.sendResponse(res, _common_1.SUCCESS.DEFAULT, catList);
        }
        catch (err) {
            next(err);
        }
    }
    async propertyDetails(req, res, next) {
        try {
            let payload = req.params;
            let pipeline = _builders_1.default.Admin.Property.PropertyDetails(payload.id);
            let details = await _entity_1.PropertyV1.basicAggregate(pipeline);
            if (details[0].status == _common_1.ENUM.PROPERTY.STATUS.ISDELETE)
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).NOT_FOUND);
            details[0].floorCount = await _entity_1.PropertySpaceV1.distinct("floorNumber", {
                propertyId: mongoose_1.Types.ObjectId(payload.id),
                status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE
            });
            if (details.length) {
                return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, details[0]);
            }
            else {
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).NOT_FOUND);
            }
        }
        catch (err) {
            next(err);
        }
    }
    async floorDetail(req, res, next) {
        try {
            let payload = req.params;
            let pipeline = await _builders_1.default.User.UserPropertyBuilder.floorDetails(payload);
            let data = await _entity_1.PropertySpaceV1.basicAggregate(pipeline);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, data);
        }
        catch (err) {
            next(err);
        }
    }
    async inActivate(req, res, next) {
        try {
            let property = await _entity_1.PropertyV1.findOne({ _id: req.params.id });
            if (property) {
                if (property.status != _common_1.ENUM.PROPERTY.STATUS.INACTIVE) {
                    _entity_1.PropertyV1.updateDocument({ _id: property._id }, { status: _common_1.ENUM.PROPERTY.STATUS.INACTIVE });
                    return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).PROPERTY_DE_ACTIVATED);
                }
                else
                    return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).PROPERTY_ALREADY_DE_ACTIVE);
            }
            else
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).NOT_FOUND);
        }
        catch (err) {
            next(err);
        }
    }
    async archive(req, res, next) {
        try {
            let property = await _entity_1.PropertyV1.findOne({ _id: mongoose_1.Types.ObjectId(req.params.id) });
            if (req === null || req === void 0 ? void 0 : req.query) {
                await Promise.all([
                    _entity_1.PropertyV1.remove({ _id: mongoose_1.Types.ObjectId(property._id) }),
                    _entity_1.UnclaimV1.remove({ propertyId: mongoose_1.Types.ObjectId(property._id) })
                ]);
                return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
            }
            if (property) {
                if (property.status != _common_1.ENUM.PROPERTY.STATUS.ARCHIVE) {
                    await _entity_1.PropertyV1.updateDocument({ _id: mongoose_1.Types.ObjectId(property._id) }, { status: _common_1.ENUM.PROPERTY.STATUS.ARCHIVE });
                    return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
                }
                else
                    return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).PROPERTY_ALREADY_DE_ACTIVE);
            }
            else
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).NOT_FOUND);
        }
        catch (err) {
            next(err);
        }
    }
    async activate(req, res, next) {
        try {
            let property = await _entity_1.PropertyV1.findOne({ _id: req.params.id });
            if (property) {
                if (property.status != _common_1.ENUM.PROPERTY.STATUS.ACTIVE) {
                    _entity_1.PropertyV1.updateDocument({ _id: property._id }, { status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE });
                    return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).PROPERTY_ACTIVATED);
                }
                else
                    return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).PROPERTY_ALREADY_ACTIVE);
            }
            else
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).NOT_FOUND);
        }
        catch (err) {
            next(err);
        }
    }
    async updateFeaturedProperty(req, res, next) {
        try {
            const { propertyId, isFeaturedProperty } = req.body;
            let response = await _entity_1.AdminV1.updateFeaturedProp(propertyId, isFeaturedProperty, next);
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Property listing",
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
                regStartDate: {
                    description: '2020-03-01T10:30:49.426Z',
                    required: false,
                },
                regEndDate: {
                    description: '2021-04-01T10:30:49.426Z',
                    required: false,
                },
                minBooking: {
                    description: '0',
                    required: false,
                },
                maxBooking: {
                    description: '100',
                    required: false,
                },
                countryId: {
                    description: '',
                    required: false,
                },
                stateId: {
                    description: '',
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
                },
                hostName: {
                    description: 'hostname',
                    required: false,
                },
                claimedStatus: {
                    description: '0/1',
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
], AdminPropertyClass.prototype, "getProperty", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Property Details",
        path: '/{id}/propertyDetails',
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
], AdminPropertyClass.prototype, "propertyDetails", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Property Details",
        path: '/floorData/:propertyId/:floorNumber',
        parameters: {
            path: {
                propertyId: {
                    description: 'mongoId',
                    required: true,
                },
                floorNumber: {
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
], AdminPropertyClass.prototype, "floorDetail", null);
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
], AdminPropertyClass.prototype, "inActivate", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Inactive",
        path: '/{id}/archive',
        parameters: {
            path: {
                id: {
                    description: 'mongoId',
                    required: true,
                }
            },
            query: {
                type: {
                    description: '1 for delete',
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
], AdminPropertyClass.prototype, "archive", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Activate",
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
], AdminPropertyClass.prototype, "activate", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "mark property featured unfeatured",
        path: '/bookSpace',
        parameters: {
            body: {
                description: 'Body for space booking',
                required: true,
                model: 'ReqAdminFeatureProperty'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AdminPropertyClass.prototype, "updateFeaturedProperty", null);
AdminPropertyClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/admins/property",
        name: "Admin Property Module",
        security: { apiKeyHeader: [] },
    }),
    __metadata("design:paramtypes", [])
], AdminPropertyClass);
exports.AdminPropertyController = new AdminPropertyClass();
//# sourceMappingURL=admin.property.controller.js.map