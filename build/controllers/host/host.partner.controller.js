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
exports.PartnerController = void 0;
const _baseController_1 = __importDefault(require("@baseController"));
const swagger_express_ts_1 = require("swagger-express-ts");
const _entity_1 = require("@entity");
const _common_1 = require("@common");
const _builders_1 = __importDefault(require("@builders"));
const mongoose_1 = require("mongoose");
var XLSX = require('xlsx');
const publisher_1 = require("./../../services/rabbitMQ/publisher");
const _services_1 = require("@services");
let HostPartnerClass = class HostPartnerClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async addPartner(req, res, next) {
        try {
            let payload = req.body;
            payload.hostId = res.locals.userId;
            let searchDuplicatePartner = await _entity_1.PartnerV1.findOne({ email: payload.email, "property._id": mongoose_1.Types.ObjectId(payload.propertyId) });
            if (searchDuplicatePartner)
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).DUPLICATE_PARTNER);
            let response = await _entity_1.PartnerV1.savePartner(payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (error) {
            next(error);
        }
    }
    async partnerListing(req, res, next) {
        try {
            let payload = req.query;
            payload.getCount = true;
            payload.userId = res.locals.userId;
            let pipeline = await _builders_1.default.User.PartnerBuilder.partnerListing(payload);
            let response = await _entity_1.PartnerV1.paginateAggregate(pipeline, payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (error) {
            next(error);
        }
    }
    async partnerFloorListing(req, res, next) {
        try {
            let payload = req.query;
            payload.partnerId = req.query.partnerId;
            payload.getCount = true;
            payload.userId = res.locals.userId;
            let pipeline;
            pipeline = await _builders_1.default.User.PartnerBuilder.completePartnerFloorData(payload);
            let response = await _entity_1.PropertySpaceV1.basicAggregate(pipeline);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response[0]);
        }
        catch (error) {
            next(error);
        }
    }
    async updatePartner(req, res, next) {
        try {
            let payload = req.body;
            payload.hostId = res.locals.userId;
            if (payload.propertyId) {
                let searchDuplicatePartner = await _entity_1.PartnerV1.findOne({ "property._id": mongoose_1.Types.ObjectId(payload.propertyId), email: payload.email, status: _common_1.ENUM.USER.STATUS.ACTIVE, _id: { $ne: mongoose_1.Types.ObjectId(payload.partnerId) } });
                if (searchDuplicatePartner)
                    return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).DUPLICATE_PARTNER);
            }
            let response = await _entity_1.PartnerV1.updatePartner(payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (error) {
            next(error);
        }
    }
    async partnerDetails(req, res, next) {
        try {
            let response = await _entity_1.PartnerV1.findOne({ _id: mongoose_1.Types.ObjectId(req.params.partnerId) });
            let floorCorners = await _entity_1.PropertyV1.findOne({ _id: mongoose_1.Types.ObjectId(response.property._id) }, { floorCorners: 1 });
            let floorCount = await _entity_1.PropertySpaceV1.distinct("floorNumber", { partnerId: mongoose_1.Types.ObjectId(req.params.partnerId), status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE });
            response.floorCount = floorCount;
            response.floorCorners = floorCorners;
            console.log(floorCount, response.partnerFloors);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            next(err);
        }
    }
    async removePartner(req, res, next) {
        try {
            switch (req.body.type) {
                case _common_1.ENUM.USER.STATUS.INACTIVE:
                    await Promise.all([_entity_1.EmployeeV1.updateEntity({ partnerId: mongoose_1.Types.ObjectId(req.body.partnerId) }, { partnerStatus: _common_1.ENUM.USER.STATUS.INACTIVE, status: _common_1.ENUM.USER.STATUS.INACTIVE }, { multi: true }),
                        _entity_1.UserV1.update({ partnerId: mongoose_1.Types.ObjectId(req.body.partnerId) }, { $pull: { partnerId: mongoose_1.Types.ObjectId(req.body.partnerId) } }, { multi: true }),
                        _entity_1.PartnerV1.updateDocument({ _id: mongoose_1.Types.ObjectId(req.body.partnerId) }, { status: _common_1.ENUM.USER.STATUS.INACTIVE }),
                        _entity_1.PartnerFloorV1.removeAll({ partnerId: mongoose_1.Types.ObjectId(req.body.partnerId) })
                    ]);
                    return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
                case _common_1.ENUM.USER.STATUS.ACTIVE:
                    let userId = [];
                    let findEmployee = await _entity_1.EmployeeV1.findMany({ partnerId: mongoose_1.Types.ObjectId(req.body.partnerId), userId: { $exists: true } }, { userId: 1, _id: 0 });
                    for (let i = 0; i < findEmployee.length; i++)
                        userId.push(mongoose_1.Types.ObjectId(findEmployee[i].userId));
                    await Promise.all([_entity_1.EmployeeV1.updateEntity({ partnerId: mongoose_1.Types.ObjectId(req.body.partnerId) }, { partnerStatus: _common_1.ENUM.USER.STATUS.ACTIVE }, { multi: true }),
                        _entity_1.PartnerV1.updateDocument({ _id: mongoose_1.Types.ObjectId(req.body.partnerId) }, { status: _common_1.ENUM.USER.STATUS.ACTIVE }),
                        _entity_1.UserV1.update({ _id: { $in: userId } }, { $addToSet: { partnerId: req.body.partnerId } })
                    ]);
                    return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
                case _common_1.ENUM.USER.STATUS.DELETE:
                    await Promise.all([_entity_1.EmployeeV1.removeAll({ partnerId: mongoose_1.Types.ObjectId(req.body.partnerId) }),
                        _entity_1.UserV1.update({ partnerId: mongoose_1.Types.ObjectId(req.body.partnerId) }, { $pull: { partnerId: mongoose_1.Types.ObjectId(req.body.partnerId) } }, { multi: true }),
                        _entity_1.PartnerV1.remove({ _id: mongoose_1.Types.ObjectId(req.body.partnerId) }),
                        _entity_1.PropertySpaceV1.update({ partnerId: mongoose_1.Types.ObjectId(req.body.partnerId) }, { $unset: { partnerId: '' } }, { multi: true })
                    ]);
                    return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
            }
        }
        catch (error) {
            next(error);
        }
    }
    async addEmployee(req, res, next) {
        try {
            let payload = req.body;
            const [searchDuplicateUser, findProperty] = await Promise.all([
                _entity_1.UserV1.findOne({ $or: [{ email: payload.email }, { phoneNo: payload.phoneNo, countryCode: payload.countryCode }] }),
                _entity_1.PartnerV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.partnerId) }, { property: 1, name: 1 })
            ]);
            payload['propertyId'] = mongoose_1.Types.ObjectId(findProperty.property._id);
            if (searchDuplicateUser) {
                let searchDuplicateEmployee = await _entity_1.EmployeeV1.findOne({ partnerId: mongoose_1.Types.ObjectId(payload.partnerId), $or: [{ email: payload.email }, { phoneNo: payload.phoneNo, countryCode: payload.countryCode }] });
                if (searchDuplicateEmployee) {
                    if (searchDuplicateEmployee.email == payload.email) {
                        return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).EMPLOYEE_EMAIL_ALREADY_EXISTS);
                    }
                    else if (searchDuplicateEmployee.phoneNo == payload.phoneNo)
                        return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).EMPLOYEE_PHONE_ALREADY_EXISTS);
                }
                else {
                    payload.partnerStatus = 'active';
                    payload.userId = mongoose_1.Types.ObjectId(searchDuplicateUser._id);
                    await Promise.all([_entity_1.UserV1.update({ _id: mongoose_1.Types.ObjectId(searchDuplicateUser._id) }, { $addToSet: { partnerId: payload.partnerId } }),
                        _entity_1.EmployeeV1.create(payload),
                        _entity_1.PartnerV1.updateOne({ _id: mongoose_1.Types.ObjectId(payload.partnerId) }, { $inc: { totalEmployees: 1 } })
                    ]);
                    let html = await _common_1.employeeSignupTemplater(payload, findProperty.name);
                    _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.NEW_SIGNUP_EMAIL(payload.email, html));
                    return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
                }
            }
            let searchDuplicateEmployee = await _entity_1.EmployeeV1.findOne({ partnerId: mongoose_1.Types.ObjectId(payload.partnerId), $or: [{ email: payload.email }, { phoneNo: payload.phoneNo, countryCode: payload.countryCode }] });
            if (searchDuplicateEmployee) {
                if (searchDuplicateEmployee.email == payload.email) {
                    return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).EMPLOYEE_EMAIL_ALREADY_EXISTS);
                }
                else if (searchDuplicateEmployee.phoneNo == payload.phoneNo)
                    return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).EMPLOYEE_PHONE_ALREADY_EXISTS);
            }
            else {
                payload.partnerStatus = 'active';
                await Promise.all([
                    _entity_1.PartnerV1.updateOne({ _id: mongoose_1.Types.ObjectId(payload.partnerId) }, { $inc: { totalEmployees: 1 } }),
                    _entity_1.EmployeeV1.create(payload)
                ]);
                let html = await _common_1.employeeSignupTemplater(payload, findProperty.name);
                _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.NEW_SIGNUP_EMAIL(payload.email, html));
                return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
            }
        }
        catch (error) {
            next(error);
        }
    }
    async addBulkEmployee(req, res, next) {
        try {
            let documentFile = req.file;
            var workbook = XLSX.readFile('./' + documentFile.path);
            var sheet_name_list = workbook.SheetNames;
            sheet_name_list.forEach(async function (y) {
                var worksheet = workbook.Sheets[y];
                var headers = {};
                var data = [];
                for (let z in worksheet) {
                    if (z[0] === '!')
                        continue;
                    var col = z.substring(0, 1);
                    var row = parseInt(z.substring(1));
                    var value = worksheet[z].v;
                    if (row == 1) {
                        headers[col] = value;
                        continue;
                    }
                    if (!data[row])
                        data[row] = {};
                    data[row][headers[col]] = value;
                }
                data.shift();
                data.shift();
                await publisher_1.rabbitMQController.publisherToInsertBulkEmployee(data, req.body.partnerId);
            });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
        }
        catch (error) {
            console.error(`we have an error in addBulkEmployee ==> ${error}`);
            next(error);
        }
    }
    async employeeListing(req, res, next) {
        try {
            let payload = req.query;
            payload.getCount = true;
            let pipeline = await _builders_1.default.User.PartnerBuilder.employeeListing(payload);
            let response = await _entity_1.EmployeeV1.paginateAggregate(pipeline, payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (error) {
            next(error);
        }
    }
    async updateEmployeeStatus(req, res, next) {
        try {
            let promise = [];
            let userData;
            switch (req.body.type) {
                case _common_1.ENUM.USER.STATUS.INACTIVE:
                    userData = await _entity_1.EmployeeV1.findOne({ _id: mongoose_1.Types.ObjectId(req.body.employeeId) });
                    if (!userData.userId) {
                        promise.push(_entity_1.PartnerV1.updateOne({ _id: mongoose_1.Types.ObjectId(userData.partnerId) }, { $inc: { totalEmployees: -1 } }));
                        promise.push(_entity_1.EmployeeV1.remove({ _id: mongoose_1.Types.ObjectId(req.body.employeeId) }));
                    }
                    else if (userData.userId) {
                        promise.push(_entity_1.UserV1.updateOne({ _id: mongoose_1.Types.ObjectId(userData.userId) }, { $pull: { partnerId: mongoose_1.Types.ObjectId(userData.partnerId) } }));
                        promise.push(_entity_1.PartnerV1.updateOne({ _id: mongoose_1.Types.ObjectId(userData.partnerId) }, { $inc: { totalEmployees: -1 } })),
                            promise.push(_entity_1.EmployeeV1.remove({ _id: mongoose_1.Types.ObjectId(req.body.employeeId) }));
                    }
                    await Promise.all(promise);
                    return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
                case _common_1.ENUM.USER.STATUS.ACTIVE:
                    userData = await _entity_1.EmployeeV1.updateDocument({ _id: mongoose_1.Types.ObjectId(req.body.employeeId) }, { partnerStatus: _common_1.ENUM.USER.STATUS.ACTIVE, status: _common_1.ENUM.USER.STATUS.ACTIVE });
                    if (!userData.userId)
                        promise.push(_entity_1.PartnerV1.updateOne({ _id: mongoose_1.Types.ObjectId(userData.partnerId) }, { $inc: { totalEmployees: 1 } }));
                    else if (userData.userId) {
                        promise.push(_entity_1.UserV1.updateOne({ _id: mongoose_1.Types.ObjectId(userData.userId) }, { $addToSet: { partnerId: mongoose_1.Types.ObjectId(userData.partnerId) } }));
                        promise.push(_entity_1.PartnerV1.updateOne({ _id: mongoose_1.Types.ObjectId(userData.partnerId) }, { $inc: { totalEmployees: 1 } }));
                    }
                    return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
            }
        }
        catch (error) {
            next(error);
        }
    }
    async employeeDetails(req, res, next) {
        try {
            let payload = req.params.userId;
            let result = await _entity_1.UserV1.fectchUserProfileDetails(payload);
            if (result.companyType == _common_1.ENUM.USER.COMPANY_TYPE.COMPANY && !result.userComapnyDetails)
                result.userComapnyDetails = {};
            return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).USER_FOUND_SUCCESSFULLY, result);
        }
        catch (err) {
            next(err);
        }
    }
    async floorDetail(req, res, next) {
        try {
            let payload = req.params;
            let pipeline = await _builders_1.default.User.PartnerBuilder.floorDetails(payload);
            let data = await _entity_1.PropertySpaceV1.basicAggregate(pipeline);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, data[0]);
        }
        catch (err) {
            next(err);
        }
    }
    async calculateEmployeeUnits(req, res, next) {
        var _a;
        try {
            let [tolalUnits, occupiedUnits] = await Promise.all([
                _entity_1.PropertySpaceV1.findOne({ _id: mongoose_1.Types.ObjectId(req.params.spaceId) }, { "units.employee": 1, _id: 0 }),
                _builders_1.default.User.PartnerBuilder.spaceUnits(req.params.spaceId, (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.partnerId)
            ]);
            let response;
            if (occupiedUnits.length > 0) {
                response = { remainingUnits: (tolalUnits.units.employee - occupiedUnits[0].count) };
            }
            else {
                response = { remainingUnits: tolalUnits.units.employee };
            }
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            next(err);
        }
    }
    async propertyFloorCount(req, res, next) {
        try {
            let floorCount = await _entity_1.PropertySpaceV1.distinct("floorNumber", { partnerId: mongoose_1.Types.ObjectId(req.params.partnerId), status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, floorCount);
        }
        catch (err) {
            next(err);
        }
    }
    async propertyCount(req, res, next) {
        var _a;
        try {
            let payload = req.params;
            let response = [];
            let partnerQuery;
            if (req.query.partnerId)
                partnerQuery = _entity_1.PartnerV1.distinct("partnerFloors", { "property._id": mongoose_1.Types.ObjectId(payload.propertyId), "_id": { $ne: mongoose_1.Types.ObjectId((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.partnerId) } });
            else
                partnerQuery = _entity_1.PartnerV1.distinct("partnerFloors", { "property._id": mongoose_1.Types.ObjectId(payload.propertyId) });
            let [details, findFLoorsInPartner] = await Promise.all([
                _entity_1.PropertySpaceV1.distinct("floorNumber", { propertyId: mongoose_1.Types.ObjectId(payload.propertyId) }),
                partnerQuery
            ]);
            response = details.filter((f) => !findFLoorsInPartner.includes(f));
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            next(err);
        }
    }
    async propertyListing(req, res, next) {
        var _a;
        try {
            let response = await _builders_1.default.User.PartnerBuilder.propertyListing((_a = res === null || res === void 0 ? void 0 : res.locals) === null || _a === void 0 ? void 0 : _a.userId);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (error) {
            next(error);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Add partner details",
        path: '/add',
        parameters: {
            body: {
                description: 'Body for add partner ',
                required: true,
                model: 'ReqAddPartnerDetail'
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
], HostPartnerClass.prototype, "addPartner", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "partner Listing",
        path: '/listing',
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
                sortBy: {
                    description: 'name/createdAt',
                    required: false,
                },
                propertyIds: {
                    description: 'property ids',
                    required: false,
                },
                toDate: {
                    description: '2020-03-01T10:30:49.426Z',
                    required: false,
                },
                fromDate: {
                    description: '2021-04-01T10:30:49.426Z',
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
], HostPartnerClass.prototype, "partnerListing", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "partner Listing",
        path: '/floorDetails/{partnerId}',
        parameters: {
            query: {
                propertyId: {
                    description: '10',
                    required: false,
                },
                floorNumber: {
                    description: 'searchkey',
                    required: false,
                },
                partnerId: {
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
], HostPartnerClass.prototype, "partnerFloorListing", null);
__decorate([
    swagger_express_ts_1.ApiOperationPatch({
        description: "Edit partner details",
        path: '/update',
        parameters: {
            body: {
                description: 'Body for update partner ',
                required: true,
                model: 'ReqUpdatePartnerDetail'
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
], HostPartnerClass.prototype, "updatePartner", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "partner details",
        path: '/details/{partnerId}',
        parameters: {
            path: {
                partnerId: {
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
], HostPartnerClass.prototype, "partnerDetails", null);
__decorate([
    swagger_express_ts_1.ApiOperationPatch({
        description: "Edit partner details",
        path: '/partnerStatus',
        parameters: {
            body: {
                description: 'Body for update partner ',
                required: true,
                model: 'ReqPartnerStatus'
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
], HostPartnerClass.prototype, "removePartner", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Add partner details",
        path: '/addEmployee',
        parameters: {
            body: {
                description: 'Body for add employee ',
                required: true,
                model: 'ReqAddEmployeeDetail'
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
], HostPartnerClass.prototype, "addEmployee", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "partner Listing",
        path: '/employee/listing',
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
                sortBy: {
                    description: 'name/createdAt/email',
                    required: false,
                },
                partnerId: {
                    description: 'mongoid',
                    required: false,
                },
                toDate: {
                    description: '2020-03-01T10:30:49.426Z',
                    required: false,
                },
                fromDate: {
                    description: '2021-04-01T10:30:49.426Z',
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
], HostPartnerClass.prototype, "employeeListing", null);
__decorate([
    swagger_express_ts_1.ApiOperationPatch({
        description: "Edit partner details",
        path: '/employee/status',
        parameters: {
            body: {
                description: 'Body for update partner ',
                required: true,
                model: 'ReqEmployeeStatus'
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
], HostPartnerClass.prototype, "updateEmployeeStatus", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "partner details",
        path: '/employee/details/{userId}',
        parameters: {
            path: {
                userId: {
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
], HostPartnerClass.prototype, "employeeDetails", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "partner details",
        path: '/floorData/{propertyId}/{floorNumber}',
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
], HostPartnerClass.prototype, "floorDetail", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "partner details",
        path: '/calculateUnits/{spaceId}',
        parameters: {
            path: {
                spaceId: {
                    description: 'mongoId',
                    required: true,
                }
            },
            query: {
                partnerId: {
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
], HostPartnerClass.prototype, "calculateEmployeeUnits", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "partner details",
        path: '/floorCount/{partnerId}',
        parameters: {
            path: {
                partnerId: {
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
], HostPartnerClass.prototype, "propertyFloorCount", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "partner details",
        path: '/floors/{propertyId}',
        parameters: {
            path: {
                propertyId: {
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
], HostPartnerClass.prototype, "propertyCount", null);
HostPartnerClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/host/partner",
        name: " Partner Module",
        security: {
            apiKeyHeader: []
        },
    }),
    __metadata("design:paramtypes", [])
], HostPartnerClass);
exports.PartnerController = new HostPartnerClass();
//# sourceMappingURL=host.partner.controller.js.map