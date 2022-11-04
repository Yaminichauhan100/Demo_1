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
exports.CoHostController = void 0;
const _baseController_1 = __importDefault(require("@baseController"));
const swagger_express_ts_1 = require("swagger-express-ts");
const mongoose_1 = require("mongoose");
const _services_1 = require("@services");
const _common_1 = require("@common");
const _entity_1 = require("@entity");
const _builders_1 = __importDefault(require("@builders"));
const htmlHelper_1 = require("../../htmlHelper");
let HostCoHostClass = class HostCoHostClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async addCoHost(req, res, next) {
        var _a;
        try {
            let payload = req.body;
            payload.userId = mongoose_1.Types.ObjectId(res.locals.userId);
            payload.hostId = mongoose_1.Types.ObjectId(res.locals.userId);
            let duplicateCohost = await _entity_1.HostV1.findOne({
                $and: [
                    {
                        $or: [
                            { email: payload.email },
                            { phoneNo: payload.phoneNo, countryCode: payload.countryCode }
                        ]
                    },
                    {
                        status: { $ne: _common_1.ENUM.PROPERTY.STATUS.ARCHIVE }
                    }
                ]
            });
            if (duplicateCohost && !duplicateCohost.isCohost)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).COHOST_ALREADY_ASSOCIATED);
            else if (duplicateCohost && (duplicateCohost === null || duplicateCohost === void 0 ? void 0 : duplicateCohost.hostId.equals(res.locals.userId))) {
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).COHOST_ALREADY_EXIST);
            }
            else if (duplicateCohost)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).COHOST_ALREADY_ASSOCIATED);
            let hostName = await _entity_1.HostV1.findOne({ _id: payload.hostId }, { name: 1 });
            let cohost = await _entity_1.HostV1.createCohost(payload);
            if ((payload === null || payload === void 0 ? void 0 : payload.territory) && typeof ((_a = payload === null || payload === void 0 ? void 0 : payload.territory) === null || _a === void 0 ? void 0 : _a.countryId) === 'number') {
                let territory = payload.territory;
                territory['cohostId'] = cohost._id;
                territory['countryId'] = [territory.countryId];
                await _entity_1.CoHostV1.createCohost(territory, mongoose_1.Types.ObjectId(payload.userId));
            }
            let html = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/deskNow_emailer/co-host_invite.html", {
                name: cohost.name, email: payload.email, password: cohost.password,
                logo: _common_1.CONSTANT.PAM_LOGO,
                hostName: hostName.name,
                url: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.HOST_PANEL_STAGING : _common_1.WEB_PANELS.HOST_PANEL_PROD,
                webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.HOST_PANEL_STAGING : _common_1.WEB_PANELS.HOST_PANEL_PROD,
                CONTACT_US: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_HOST_STAGING : _common_1.WEB_PANELS.CONTACT_US_PAM_PROD,
                FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_HOST_STAGING : _common_1.WEB_PANELS.FAQ_PAM_PROD,
                facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                igLogo: _common_1.CONSTANT.INSTAGRAM_LOGO,
            });
            await _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.NEW_COHOST_EMAIL(payload.email, html, hostName.name));
            this.sendResponse(res, _common_1.SUCCESS.CO_HOST_ADDED, cohost);
        }
        catch (err) {
            next(err);
        }
    }
    async addCoHostTerritory(req, res, next) {
        try {
            let payload = req.body;
            payload.countryId = [payload.countryId];
            await _entity_1.CoHostV1.addTerritory(payload, mongoose_1.Types.ObjectId(res.locals.userId));
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
        }
        catch (err) {
            next(err);
        }
    }
    async editCoHostTerritory(req, res, next) {
        try {
            let payload = req.body;
            payload.countryId = [payload.countryId];
            let promise = [];
            let cohost = await _entity_1.CoHostV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.id) }, { cohostId: 1, accessLevel: 1, city: 1, state: 1 });
            payload.cohostId = cohost.cohostId;
            if (cohost.accessLevel == 1) {
                promise.push(_entity_1.CoHostV1.remove({ _id: mongoose_1.Types.ObjectId(payload.id) }));
                promise.push(_entity_1.PropertyV1.update({ "country.id": { $in: payload.countryId }, userId: mongoose_1.Types.ObjectId(res.locals.userId) }, { $pull: { coHostId: payload.cohostId } }));
            }
            else {
                if (cohost.city.length > 1) {
                    let cityData = [];
                    for (let i = 0; i < cohost.city.length; i++) {
                        cityData.push(mongoose_1.Types.ObjectId(cohost.city[i]._id));
                    }
                    promise.push(_entity_1.CoHostV1.remove({ _id: mongoose_1.Types.ObjectId(payload.id) }));
                    promise.push(_entity_1.PropertyV1.update({ "city._id": { $in: cityData }, userId: mongoose_1.Types.ObjectId(res.locals.userId) }, { $pull: { coHostId: payload.cohostId } }));
                }
                else if (cohost.state.length > 1) {
                    let stateData = [];
                    for (let i = 0; i < cohost.state.length; i++) {
                        stateData.push(cohost.state[i].id);
                    }
                    promise.push(_entity_1.CoHostV1.remove({ _id: mongoose_1.Types.ObjectId(payload.id) }));
                    promise.push(_entity_1.PropertyV1.update({ "state.id": { $in: stateData }, userId: mongoose_1.Types.ObjectId(res.locals.userId) }, { $pull: { coHostId: payload.cohostId } }));
                }
                else {
                    promise.push(_entity_1.CoHostV1.remove({ _id: mongoose_1.Types.ObjectId(payload.id) }));
                    promise.push(_entity_1.PropertyV1.update({ "state.id": { $in: payload.stateId }, userId: mongoose_1.Types.ObjectId(res.locals.userId) }, { $pull: { coHostId: payload.cohostId } }));
                }
            }
            await Promise.all(promise);
            await _entity_1.CoHostV1.addTerritory(payload, mongoose_1.Types.ObjectId(res.locals.userId));
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
        }
        catch (err) {
            console.error(`we have an error ==> ${err}`);
            next(err);
        }
    }
    async getCoHostListing(req, res, next) {
        try {
            let payload = req.query;
            payload.userId = res.locals.userId;
            payload.getCount = true;
            let pipeline = await _builders_1.default.User.HostBUilder.cohostLiting(payload);
            let hostLisitng = await _entity_1.HostV1.paginateAggregate(pipeline, payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, hostLisitng);
        }
        catch (err) {
            next(err);
        }
    }
    async getAllCountries(req, res, next) {
        try {
            let hostId = res.locals.userId;
            if (res.locals.userData.isCohost)
                hostId = res.locals.userData.hostId;
            if (res.locals.userData.isCohost && res.locals.userData.accessLevel != _common_1.ENUM.COHOST_LEVEL.STATUS.ALL) {
                let countryData;
                let countrId = [];
                let cohost = await _entity_1.CoHostV1.findMany({ cohostId: mongoose_1.Types.ObjectId(res.locals.userId) }, { country: 1 });
                for (let i = 0; i < cohost.length; i++) {
                    countrId.push(cohost[i].country[0].id);
                }
                let pipeline1 = _builders_1.default.User.HostBUilder.countryListingForFilters(countrId);
                countryData = await _entity_1.CountriesV1.basicAggregate(pipeline1);
                return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, countryData);
            }
            let pipeline = await _builders_1.default.User.HostBUilder.countryList(hostId);
            let countryData = await _entity_1.PropertyV1.basicAggregate(pipeline);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, countryData);
        }
        catch (err) {
            next(err);
        }
    }
    async getMulitpleStates(req, res, next) {
        try {
            let payload = req.query;
            payload.userId = res.locals.userId;
            if (res.locals.userData.isCohost)
                payload.userId = res.locals.userData.hostId;
            if (res.locals.userData.isCohost && res.locals.userData.accessLevel != _common_1.ENUM.COHOST_LEVEL.STATUS.ALL) {
                let countrId = [];
                let cohost = await _entity_1.CoHostV1.findMany({ cohostId: mongoose_1.Types.ObjectId(res.locals.userId), "country.id": parseInt(req.query.countryId) }, { _id: 0, state: 1, accessLevel: 1 });
                if (cohost.length == 1 && cohost[0].accessLevel == _common_1.ENUM.COHOST_LEVEL.STATUS.COUNTRY) {
                    let pipeline = await _builders_1.default.User.HostBUilder.stateList(payload);
                    let stateData = await _entity_1.PropertyV1.basicAggregate(pipeline);
                    return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, stateData);
                }
                for (let i = 0; i < cohost.length; i++) {
                    {
                        for (let j = 0; j < cohost[i].state.length; j++) {
                            countrId.push(cohost[i].state[j].id);
                        }
                    }
                }
                let pipeline1 = _builders_1.default.User.HostBUilder.countryListingForFilters(countrId);
                let stateData = await _entity_1.StatesV1.basicAggregate(pipeline1);
                return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, stateData);
            }
            let pipeline = await _builders_1.default.User.HostBUilder.stateList(payload);
            let stateData = await _entity_1.PropertyV1.basicAggregate(pipeline);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, stateData);
        }
        catch (err) {
            next(err);
        }
    }
    async getCities(req, res, next) {
        try {
            let payload = req.query;
            payload.userId = res.locals.userId;
            if (res.locals.userData.isCohost)
                payload.userId = res.locals.userData.hostId;
            if (res.locals.userData.isCohost && res.locals.userData.accessLevel != _common_1.ENUM.COHOST_LEVEL.STATUS.ALL) {
                let cityData;
                let cityIds = [];
                let response = await _entity_1.CoHostV1.findOne({ cohostId: mongoose_1.Types.ObjectId(res.locals.userId), "state.id": parseInt(req.query.stateId), }, { "state": 1, "accessLevel": 1 });
                if (!response) {
                    let pipeline = await _builders_1.default.User.HostBUilder.cityList(payload);
                    let stateData = await _entity_1.PropertyV1.basicAggregate(pipeline);
                    return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, stateData);
                }
                let [state, city, level3] = await Promise.all([
                    _entity_1.CoHostV1.findMany({ cohostId: mongoose_1.Types.ObjectId(res.locals.userId), "state.id": parseInt(req.query.stateId), accessLevel: 2 }, { "state": 1 }),
                    _entity_1.CoHostV1.findMany({ cohostId: mongoose_1.Types.ObjectId(res.locals.userId), "state.id": parseInt(req.query.stateId), accessLevel: _common_1.ENUM.COHOST_LEVEL.STATUS.PROPERTY }, { city: 1 }),
                    _entity_1.CoHostV1.findMany({ cohostId: mongoose_1.Types.ObjectId(res.locals.userId), "state.id": parseInt(req.query.stateId), accessLevel: _common_1.ENUM.COHOST_LEVEL.STATUS.CITY }, { city: 1 }),
                ]);
                if (city.length > 0) {
                    for (let i = 0; i < city.length; i++) {
                        for (let j = 0; j < city[i].city.length; j++)
                            cityIds.push(mongoose_1.Types.ObjectId(city[i].city[j]._id));
                    }
                    cityData = await _entity_1.CityV1.findMany({ _id: { $in: cityIds } });
                }
                if (level3.length > 0) {
                    for (let i = 0; i < level3.length; i++) {
                        for (let j = 0; j < level3[i].city.length; j++)
                            cityIds.push(mongoose_1.Types.ObjectId(level3[i].city[j]._id));
                    }
                    cityData = await _entity_1.CityV1.findMany({ _id: { $in: cityIds } });
                }
                else if (state.length > 0) {
                    let pipeline1 = _builders_1.default.User.HostBUilder.cityListing(req.query);
                    cityData = await _entity_1.CityV1.basicAggregate(pipeline1);
                }
                return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, cityData);
            }
            let pipeline = await _builders_1.default.User.HostBUilder.cityList(payload);
            let stateData = await _entity_1.PropertyV1.basicAggregate(pipeline);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, stateData);
        }
        catch (err) {
            next(err);
        }
    }
    async getProperties(req, res, next) {
        try {
            let payload = req.query;
            let cityArray = [];
            cityArray = payload.cityId.split(",");
            let propertyData = await _entity_1.PropertyV1.findMany({ userId: mongoose_1.Types.ObjectId(res.locals.userId), status: 'active', "city._id": { $in: cityArray } }, { _id: 1, name: 1, address: 1 });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, propertyData);
        }
        catch (err) {
            next(err);
        }
    }
    async cohostDetails(req, res, next) {
        try {
            let payload = req.params;
            let response;
            payload.userId = res.locals.userId;
            payload.userData = res.locals.userData;
            let cohost = await _entity_1.HostV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.cohostId) }, { name: 1, _id: 1, email: 1, image: 1, countryCode: 1, phoneNo: 1, level: 1, createdAt: 1, permissions: 1, status: 1 });
            switch (payload.type) {
                case 0:
                    response = await _entity_1.CoHostV1.findMany({ cohostId: mongoose_1.Types.ObjectId(payload.cohostId) }, { cityId: 1, stateId: 1, countryId: 1 });
                    return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, { cohostData: cohost, territory: response });
                case 1:
                    response = await _entity_1.CoHostV1.findMany({ cohostId: mongoose_1.Types.ObjectId(payload.cohostId) }, { city: 1, state: 1, country: 1, property: 1 });
                    return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, { cohostData: cohost, territory: response });
            }
        }
        catch (err) {
            next(err);
        }
    }
    async getCohostDetails(req, res, next) {
        try {
            let payload = req.params;
            let response;
            response = await _entity_1.CoHostV1.findMany({ _id: mongoose_1.Types.ObjectId(payload.id) }, { city: 1, state: 1, country: 1, property: 1 });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response[0]);
        }
        catch (err) {
            next(err);
        }
    }
    async updateCoHost(req, res, next) {
        try {
            let payload = req.body;
            payload.userId = mongoose_1.Types.ObjectId(res.locals.userId);
            await _entity_1.HostV1.updateDocument({ _id: payload.id }, payload, { new: true });
            this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
        }
        catch (err) {
            next(err);
        }
    }
    async activateProperty(req, res, next) {
        try {
            switch (req.body.type) {
                case _common_1.ENUM.COHOST_PERMISSION.TYPE.INACTIVE:
                    await Promise.all([
                        _entity_1.HostV1.updateDocument({ _id: mongoose_1.Types.ObjectId(req.body.id) }, { status: _common_1.ENUM.PROPERTY.STATUS.INACTIVE }),
                        _entity_1.HostV1.removePreviousSession(req.body.id, false)
                    ]);
                    return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).COHOST_DE_ACTIVATED);
                case _common_1.ENUM.COHOST_PERMISSION.TYPE.ACTIVE:
                    await _entity_1.HostV1.updateDocument({ _id: mongoose_1.Types.ObjectId(req.body.id) }, { status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE });
                    return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).COHOST_ACTIVATED);
                case _common_1.ENUM.COHOST_PERMISSION.TYPE.ARCHIVE:
                    await Promise.all([
                        _entity_1.HostV1.updateDocument({ _id: mongoose_1.Types.ObjectId(req.body.id) }, { status: _common_1.ENUM.PROPERTY.STATUS.ARCHIVE }),
                        _entity_1.HostV1.removePreviousSession(req.body.id, false)
                    ]);
                    return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).COHOST_DELETED);
            }
        }
        catch (err) {
            next(err);
        }
    }
    async deletePermission(req, res, next) {
        try {
            let payload = req.body;
            payload.userId = mongoose_1.Types.ObjectId(res.locals.userId);
            let cohost = await _entity_1.CoHostV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.id) }, { _id: 1, accessLevel: 1, hostId: 1, country: 1, cohostId: 1, state: 1, city: 1, property: 1 });
            switch (cohost.accessLevel) {
                case 1:
                    let countryId = cohost.country.id;
                    await Promise.all([
                        _entity_1.CoHostV1.remove({ _id: mongoose_1.Types.ObjectId(payload.id) }),
                        _entity_1.PropertyV1.update({
                            userId: mongoose_1.Types.ObjectId(payload.userId),
                            "country.id": { $in: countryId }
                        }, { $pull: { coHostId: mongoose_1.Types.ObjectId(cohost.cohostId) } }, { multi: true }),
                    ]);
                    break;
                case 2:
                    let stateId = [];
                    for (let i = 0; i < cohost.state.length; i++) {
                        stateId.push(cohost.state[i].id);
                    }
                    await Promise.all([
                        _entity_1.CoHostV1.remove({ _id: mongoose_1.Types.ObjectId(payload.id) }),
                        _entity_1.PropertyV1.update({
                            userId: mongoose_1.Types.ObjectId(payload.userId),
                            "state.id": { $in: stateId }
                        }, { $pull: { coHostId: mongoose_1.Types.ObjectId(cohost.cohostId) } }, { multi: true }),
                    ]);
                    break;
                case 3:
                    let cityId = [];
                    for (let i = 0; i < cohost.city.length; i++) {
                        cityId.push(mongoose_1.Types.ObjectId(cohost.city[i]._id));
                    }
                    await Promise.all([
                        _entity_1.CoHostV1.remove({ _id: mongoose_1.Types.ObjectId(payload.id) }),
                        _entity_1.PropertyV1.update({ "city._id": { $in: cityId }, userId: payload.userId }, { $pull: { coHostId: mongoose_1.Types.ObjectId(cohost.cohostId) } }),
                    ]);
                    break;
                case 4:
                    let propertyId = [];
                    for (let i = 0; i < cohost.property.length; i++) {
                        propertyId.push(mongoose_1.Types.ObjectId(cohost.property[i]._id));
                    }
                    await Promise.all([
                        _entity_1.CoHostV1.remove({ _id: mongoose_1.Types.ObjectId(payload.id) }),
                        _entity_1.PropertyV1.update({
                            userId: mongoose_1.Types.ObjectId(payload.userId),
                            "_id": { $in: propertyId }
                        }, { $pull: { coHostId: mongoose_1.Types.ObjectId(cohost.cohostId) } }, { multi: true }),
                    ]);
                    break;
            }
            let result = await _entity_1.CoHostV1.findMany({ cohostId: mongoose_1.Types.ObjectId(cohost.cohostId) });
            if (result.length == 0) {
                await _entity_1.HostV1.updateDocument({ _id: mongoose_1.Types.ObjectId(cohost.cohostId) }, { accessLevel: _common_1.ENUM.COHOST_LEVEL.STATUS.ALL });
            }
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
        }
        catch (err) {
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Create contact us by host",
        path: '/add',
        parameters: {
            body: {
                description: 'Body for update user profile',
                required: true,
                model: 'ReqAddCoHostModel'
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
], HostCoHostClass.prototype, "addCoHost", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Create contact us by host",
        path: '/addTerritory',
        parameters: {
            body: {
                description: 'Body for update user profile',
                required: true,
                model: 'ReqAddCoHostTerritoyModel'
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
], HostCoHostClass.prototype, "addCoHostTerritory", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Create contact us by host",
        path: '/editTerritory',
        parameters: {
            body: {
                description: 'Body for update user profile',
                required: true,
                model: 'ReqEditCoHostTerritoyModel'
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
], HostCoHostClass.prototype, "editCoHostTerritory", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get Countries",
        path: '/',
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
], HostCoHostClass.prototype, "getCoHostListing", null);
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
], HostCoHostClass.prototype, "getAllCountries", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get states",
        path: '/getMultipleStates',
        parameters: {
            query: {
                countryId: {
                    description: 'countryIds',
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
], HostCoHostClass.prototype, "getMulitpleStates", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get states",
        path: '/getCities',
        parameters: {
            query: {
                stateId: {
                    description: 'countryIds',
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
], HostCoHostClass.prototype, "getCities", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get states",
        path: '/getProperties',
        parameters: {
            query: {
                cityId: {
                    description: 'countryIds',
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
], HostCoHostClass.prototype, "getProperties", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Delete Notification",
        path: '/details/{cohostId}/{type}',
        parameters: {
            path: {
                cohostId: {
                    description: 'cohostId',
                    required: true,
                },
                type: {
                    description: '',
                    required: false
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
], HostCoHostClass.prototype, "cohostDetails", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Delete Notification",
        path: '/getCohostDetails/{id}',
        parameters: {
            path: {
                id: {
                    description: 'cohostId',
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
], HostCoHostClass.prototype, "getCohostDetails", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Create contact us by host",
        path: '/updateCohostProfile',
        parameters: {
            body: {
                description: 'Body for update user profile',
                required: true,
                model: 'ReqUpdateCoHostModel'
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
], HostCoHostClass.prototype, "updateCoHost", null);
__decorate([
    swagger_express_ts_1.ApiOperationPatch({
        description: "Activate Property",
        path: '/',
        parameters: {
            body: {
                description: 'Body for update property ',
                required: true,
                model: 'ReqPropertyStatus'
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
], HostCoHostClass.prototype, "activateProperty", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Create contact us by host",
        path: '/delete-permission',
        parameters: {
            body: {
                description: 'Body for update user profile',
                required: true,
                model: 'ReqUpdateCoHostAceessModel'
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
], HostCoHostClass.prototype, "deletePermission", null);
HostCoHostClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/host/coHost",
        name: " CoHost Module",
        security: {
            apiKeyHeader: []
        },
    }),
    __metadata("design:paramtypes", [])
], HostCoHostClass);
exports.CoHostController = new HostCoHostClass();
//# sourceMappingURL=host.cohost.controller.js.map