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
exports.AdminClaimPropertyController = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const _baseController_1 = __importDefault(require("@baseController"));
const _common_1 = require("@common");
const xlsx_1 = __importDefault(require("xlsx"));
const _entity_1 = require("@entity");
const _builders_1 = __importDefault(require("@builders"));
const mongoose_1 = require("mongoose");
const _services_1 = require("@services");
const htmlHelper_1 = require("../../htmlHelper");
let AdminClaimPropertyClass = class AdminClaimPropertyClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async getCountries(req, res, next) {
        try {
            let countryData;
            let data = await _entity_1.CityV1.findMany({ isDelete: false, status: "active" });
            let payload = [];
            for (let i = 0; i < data.length; i++) {
                payload.push(data[i].countryId);
            }
            let pipeline1 = _builders_1.default.User.HostBUilder.countryListing(payload);
            countryData = await _entity_1.CountriesV1.basicAggregate(pipeline1);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, countryData);
        }
        catch (err) {
            console.error(`we have an error in getCountries ==> ${err}`);
            next(err);
        }
    }
    async getPropertyStates(req, res, next) {
        try {
            let stateData;
            let data = await _entity_1.CityV1.findMany({ countryId: req.params.countryId, isDelete: false, status: "active" });
            let payload = [];
            for (let i = 0; i < data.length; i++) {
                payload.push(data[i].stateId);
            }
            let pipeline1 = _builders_1.default.User.HostBUilder.countryListing(payload);
            stateData = await _entity_1.StatesV1.basicAggregate(pipeline1);
            if (stateData.length == 0)
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).NO_STATE_DATA, []);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, stateData);
        }
        catch (err) {
            console.error(`we have an error in getPropertyStates ==> ${err}`);
            next(err);
        }
    }
    async getPropertyCities(req, res, next) {
        try {
            let cityData;
            let pipeline1 = _builders_1.default.User.HostBUilder.cityListing(req.params);
            cityData = await _entity_1.CityV1.basicAggregate(pipeline1);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, cityData);
        }
        catch (err) {
            console.error(`we have an error in getPropertyCities ==> ${err}`);
            next(err);
        }
    }
    async fetchSampleSheet(req, res, next) {
        try {
            const sampleSheetUrl = _common_1.CONSTANT.ADD_PROPERTY_SAMPLE;
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, { sampleSheetUrl: sampleSheetUrl });
        }
        catch (err) {
            console.error(`error while fetching sample sheet ==> ${err}`);
            next(err);
        }
    }
    async insertClaimedProperty(req, res, next) {
        var _a;
        try {
            const adminEmail = await _entity_1.AdminV1.findOne({ _id: mongoose_1.Types.ObjectId((_a = res === null || res === void 0 ? void 0 : res.locals) === null || _a === void 0 ? void 0 : _a.adminId) }, { email: 1 });
            let documentFile = req === null || req === void 0 ? void 0 : req.file;
            const workbook = xlsx_1.default.readFile('./' + documentFile.path);
            let sheetData = workbook === null || workbook === void 0 ? void 0 : workbook.SheetNames;
            const locationPayload = req.body;
            sheetData.forEach(sheet => {
                var _a;
                const worksheet = workbook.Sheets[sheet];
                const headers = {};
                let data = [];
                for (let z in worksheet) {
                    (_a = worksheet === null || worksheet === void 0 ? void 0 : worksheet.E2) === null || _a === void 0 ? void 0 : _a.w.split('+').join().trim();
                    if (z[0] === '!')
                        continue;
                    const col = z.substring(0, 1);
                    const row = parseInt(z.substring(1));
                    let value = worksheet[z].v;
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
                _entity_1.AdminPropertyClaimV1.insertBulkProperties(data, locationPayload, adminEmail);
            });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (err) {
            console.error(`we have an error while inserting claimed property, ${err}`);
            next(err);
        }
    }
    async fetchClaimedProperties(req, res, next) {
        try {
            const params = req.query;
            if ((params === null || params === void 0 ? void 0 : params.countryId) || (params === null || params === void 0 ? void 0 : params.stateId) || (params === null || params === void 0 ? void 0 : params.cityId)) {
                parseInt(params === null || params === void 0 ? void 0 : params.countryId);
                parseInt(params === null || params === void 0 ? void 0 : params.stateId);
                parseInt(params === null || params === void 0 ? void 0 : params.cityId);
            }
            const pipeline = _builders_1.default.Admin.Property.ClaimedPropertyListing(params);
            params && params.limit ? params.limit = params.limit : params.limit = 10;
            params['getCount'] = true;
            const claimedPropertyListing = await _entity_1.UnclaimV1.paginateAggregate(pipeline, Object.assign(Object.assign({}, params), { getCount: true }));
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, claimedPropertyListing);
        }
        catch (error) {
            console.error(`we have an error while inserting claimed property, ${error}`);
            next(error);
        }
    }
    async fetchClaimedPropertyDetail(req, res, next) {
        try {
            const hostDetail = req.query;
            const propertyDetail = req.params;
            const claimedPropertyDetail = await _entity_1.PropertyV1.basicAggregate([
                { $match: { _id: mongoose_1.Types.ObjectId(propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.propertyId) } },
                {
                    "$lookup": {
                        "from": "unclaimedProperties",
                        "let": { "propertyId": "$propertyId" },
                        "pipeline": [
                            {
                                '$match': {
                                    $and: [
                                        { $expr: { $eq: ['$propertyId', mongoose_1.Types.ObjectId(propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.propertyId)] } },
                                        { $expr: { $eq: ["$userId", mongoose_1.Types.ObjectId(hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.hostId)] } }
                                    ]
                                }
                            }
                        ],
                        "as": "claimedDetails"
                    }
                },
                { $unwind: "$claimedDetails" },
                {
                    "$lookup": {
                        "from": "hosts",
                        "pipeline": [
                            {
                                '$match': {
                                    $and: [
                                        { $expr: { $eq: ['$_id', mongoose_1.Types.ObjectId(hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.hostId)] } },
                                    ]
                                }
                            },
                            { $project: { "name": 1, email: 1, phoneNo: 1, image: 1 } }
                        ],
                        "as": "hostDetail"
                    }
                },
                { $unwind: "$hostDetail" },
            ]);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, claimedPropertyDetail);
        }
        catch (error) {
            console.error(`we have an error while fetchClaimedPropertyDetail, ${error}`);
            next(error);
        }
    }
    async updateClaimedProperty(req, res, next) {
        try {
            let payload = req.body;
            const headers = req.headers;
            if (payload === null || payload === void 0 ? void 0 : payload.location) {
                payload['location'] = { 'coordinates': payload.location };
                payload['location'].type = "Point";
            }
            ;
            const property = await _entity_1.PropertyV1.findOne({ '_id': mongoose_1.Types.ObjectId(payload.id) });
            if (property) {
                await _entity_1.AdminPropertyClaimV1.validateAndUpdateProperty(property, payload, headers, res);
            }
            else
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).NOT_FOUND);
        }
        catch (err) {
            console.error(`we have an error while updateClaimedProperty ==> ${err}`);
            next(err);
        }
    }
    async fetchClaimedPropertyRequest(req, res, next) {
        try {
            const params = req.params;
            const claimedPropertyDetail = await _entity_1.PropertyV1.findOne({ _id: mongoose_1.Types.ObjectId(params.propertyId) });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, claimedPropertyDetail);
        }
        catch (error) {
            console.error(`we have an error while fetchClaimedPropertyDetail, ${error}`);
            next(error);
        }
    }
    async updateClaimedPropertyStatus(req, res, next) {
        try {
            const params = req.body;
            const [hostDetail, propertyDetail] = await Promise.all([
                _entity_1.HostV1.findOne({ _id: mongoose_1.Types.ObjectId(params === null || params === void 0 ? void 0 : params.hostId) }),
                _entity_1.PropertyV1.findOne({ _id: mongoose_1.Types.ObjectId(params === null || params === void 0 ? void 0 : params.propertyId) })
            ]);
            let userData = {
                name: hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.name,
                image: (hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.image) ? hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.image : "",
                userId: hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail._id,
                email: hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.email,
                bio: (hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.bio) ? hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.bio : "",
                fbUrl: (hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.fbUrl) ? hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.fbUrl : "",
                twitterUrl: (hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.twitterUrl) ? hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.twitterUrl : "",
                linkedinUrl: (hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.linkedinUrl) ? hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.linkedinUrl : "",
                instaUrl: (hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.instaUrl) ? hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.instaUrl : "",
                youtubeUrl: (hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.youtubeUrl) ? hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.youtubeUrl : "",
                slackUrl: (hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.slackUrl) ? hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.slackUrl : ""
            };
            const html = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(`${_common_1.CONSTANT.EMAIL_TEMPLATES}` + "claim_property_invite.html", {
                name: hostDetail.name, ASSET_PATH: _common_1.BASE.URL,
                propertyName: propertyDetail.propertyName,
                url: `${_common_1.WEB_PANELS.HOST_PANEL_PROD}/account/login`,
                logo: _common_1.CONSTANT.PAM_LOGO,
                facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                igLogo: _common_1.CONSTANT.INSTAGRAM_LOGO,
                status: params.status == _common_1.ENUM.PROPERTY.CLAIMED_PROPERTY_STATUS.SUCCESS ? 'accepted successfully.' : 'rejected',
                twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                fbUrl: _common_1.WEB_PANELS.PAM_FB_URL,
                instaUrl: _common_1.WEB_PANELS.PAM_INSTA_URL,
                twitterUrl: _common_1.WEB_PANELS.PAM_TWITTER_URL,
                linkedinUrl: _common_1.WEB_PANELS.PAM_LINKEDIN_URL,
                webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.HOST_PANEL_STAGING : _common_1.WEB_PANELS.HOST_PANEL_PROD,
                CONTACT_US: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_HOST_STAGING : _common_1.WEB_PANELS.CONTACT_US_PAM_PROD,
                FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_HOST_STAGING : _common_1.WEB_PANELS.FAQ_PAM_PROD,
            });
            switch (params.status) {
                case _common_1.ENUM.PROPERTY.CLAIMED_PROPERTY_STATUS.SUCCESS:
                    await Promise.all([
                        _entity_1.UnclaimV1.updateOne({
                            propertyId: mongoose_1.Types.ObjectId(params === null || params === void 0 ? void 0 : params.propertyId),
                            userId: mongoose_1.Types.ObjectId(params === null || params === void 0 ? void 0 : params.hostId)
                        }, { status: params === null || params === void 0 ? void 0 : params.status }),
                        _entity_1.PropertyV1.updateWithDeleteDocument({ _id: mongoose_1.Types.ObjectId(params === null || params === void 0 ? void 0 : params.propertyId) }, { userData: userData, userId: params === null || params === void 0 ? void 0 : params.hostId, claimedStatus: true }, { claimingHosts: "" }),
                        _services_1.emailService.sendClaimRequestSuccessEmail(html, hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.email, hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.name, 'accepted successfully')
                    ]);
                    await _entity_1.UnclaimV1.removeAll({
                        propertyId: mongoose_1.Types.ObjectId(params === null || params === void 0 ? void 0 : params.propertyId),
                        userId: { $ne: mongoose_1.Types.ObjectId(params === null || params === void 0 ? void 0 : params.hostId) }
                    });
                    break;
                case _common_1.ENUM.PROPERTY.CLAIMED_PROPERTY_STATUS.FAILURE:
                    await Promise.all([
                        _entity_1.UnclaimV1.updateOne({
                            propertyId: mongoose_1.Types.ObjectId(params === null || params === void 0 ? void 0 : params.propertyId),
                            userId: mongoose_1.Types.ObjectId(params === null || params === void 0 ? void 0 : params.hostId)
                        }, { status: params === null || params === void 0 ? void 0 : params.status }),
                        _entity_1.PropertyV1.updateOne({ _id: mongoose_1.Types.ObjectId(params === null || params === void 0 ? void 0 : params.propertyId) }, { $pull: { claimingHosts: mongoose_1.Types.ObjectId(params === null || params === void 0 ? void 0 : params.hostId) } }),
                        _services_1.emailService.sendClaimRequestSuccessEmail(html, hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.email, hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.name, 'rejected')
                    ]);
                    break;
            }
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (error) {
            console.error(`we have an error while fetchClaimedPropertyDetail, ${error}`);
            next(error);
        }
    }
    async amenitiesListing(req, res, next) {
        try {
            let amenities = await _entity_1.AmenitiesV1.basicAggregate([
                { $match: { status: 'active' } },
                {
                    $group: {
                        _id: { type: "$type" },
                        amenitiesData: {
                            $addToSet: {
                                iconImage: "$iconImage",
                                name: "$name",
                                status: "$status",
                                type: "$type",
                                _id: "$_id"
                            }
                        }
                    }
                },
                { $sort: { "_id.type": 1 } }
            ]);
            return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).AMINTIES_LISTING, amenities);
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
], AdminClaimPropertyClass.prototype, "getCountries", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get states",
        path: '/addProperty/getStates/{countryId}',
        parameters: {
            path: {
                countryId: {
                    description: 'countryId',
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
], AdminClaimPropertyClass.prototype, "getPropertyStates", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get states",
        path: '/addProperty/getCities/{stateId}',
        parameters: {
            path: {
                stateId: {
                    description: 'stateId',
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
], AdminClaimPropertyClass.prototype, "getPropertyCities", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Amenities Listing",
        path: '/amenities',
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
], AdminClaimPropertyClass.prototype, "amenitiesListing", null);
AdminClaimPropertyClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/admins/property/claim",
        name: "Admin Claim Property Module",
        security: { apiKeyHeader: [] },
    }),
    __metadata("design:paramtypes", [])
], AdminClaimPropertyClass);
exports.AdminClaimPropertyController = new AdminClaimPropertyClass();
//# sourceMappingURL=admin.property.claim.controller.js.map