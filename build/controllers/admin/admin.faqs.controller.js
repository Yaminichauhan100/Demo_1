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
exports.AdminFaqController = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const _baseController_1 = __importDefault(require("@baseController"));
const _entity_1 = require("@entity");
const _common_1 = require("@common");
const _builders_1 = __importDefault(require("@builders"));
let FaqClass = class FaqClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async questionAndAnswer(req, res, next) {
        try {
            let payload = req.body;
            await _entity_1.FaqV1.create(payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
        }
        catch (err) {
            next(err);
        }
    }
    async fetchQuestionAndAnswer(req, res, next) {
        try {
            let payload = req.query;
            payload.getCount = true;
            let pipeline = await _builders_1.default.Admin.FAQ.FaqListing(payload);
            let response = await _entity_1.FaqV1.paginateAggregate(pipeline, payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            next(err);
        }
    }
    async questionAndAnswerDetails(req, res, next) {
        try {
            let payload = req.params;
            let response = await _entity_1.FaqV1.findOne({ _id: payload.id });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            next(err);
        }
    }
    async EditQuestionAndAnswer(req, res, next) {
        try {
            let payload = req.body;
            await _entity_1.FaqV1.updateEntity({ _id: payload.id }, payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
        }
        catch (err) {
            next(err);
        }
    }
    async DeleteQuestionAndAnswer(req, res, next) {
        try {
            let payload = req.params;
            await _entity_1.FaqV1.remove({ _id: payload.id });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
        }
        catch (err) {
            next(err);
        }
    }
    async termsAndCondition(req, res, next) {
        try {
            let payload = req.body;
            await _entity_1.AppPolicyV1.updateEntity({ lang: req.body.lang, type: req.body.type, status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE, userType: payload.userType }, payload, { upsert: true });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
        }
        catch (err) {
            next(err);
        }
    }
    async fetchTermsAndCondition(req, res, next) {
        try {
            let response = await _entity_1.AppPolicyV1.findOne({ lang: req.query.lang, type: req.query.type, status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE, userType: req.query.userType });
            if (!response) {
                response = {};
                response.content = "",
                    response.lang = req.query.lang,
                    response.type = req.query.type;
            }
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            next(err);
        }
    }
    async fetchAllTermAndCondition(req, res, next) {
        try {
            let response = await _entity_1.AppPolicyV1.listAllAppConfig(req.query);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            next(err);
        }
    }
    async getCmsDetails(req, res, next) {
        try {
            let response = await _entity_1.AppPolicyV1.findOne({ lang: req.query.lang, type: req.query.type, status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE, userType: req.query.userType });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Admin details",
        path: '/qna',
        parameters: {
            body: {
                description: 'Body for add amenities',
                required: true,
                model: 'ReqAddFaqModel'
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
], FaqClass.prototype, "questionAndAnswer", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Admin details",
        path: '/qna',
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
                lang: {
                    description: 'language',
                    required: true,
                },
                sortOrder: {
                    description: '-1/1',
                    required: false,
                },
                sortKey: {
                    description: 'question',
                    required: false,
                },
                userType: {
                    description: 'question',
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
], FaqClass.prototype, "fetchQuestionAndAnswer", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Admin details",
        path: '/qnaDetails/{id}',
        parameters: {
            path: {
                id: {
                    description: 'mongo db',
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
], FaqClass.prototype, "questionAndAnswerDetails", null);
__decorate([
    swagger_express_ts_1.ApiOperationPatch({
        description: "Admin details",
        path: '/qna',
        parameters: {
            query: {
                id: {
                    description: 'mongoId',
                    required: false,
                },
                question: {
                    description: '?',
                    required: false,
                },
                answer: {
                    description: 'answer',
                    required: false,
                },
                lang: {
                    description: 'EN',
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
], FaqClass.prototype, "EditQuestionAndAnswer", null);
__decorate([
    swagger_express_ts_1.ApiOperationDelete({
        description: "Admin details",
        path: '/qna/{id}',
        parameters: {
            path: {
                id: {
                    description: 'mongo id',
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
], FaqClass.prototype, "DeleteQuestionAndAnswer", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Admin details",
        path: '/cms',
        parameters: {
            body: {
                description: 'Body for add amenities',
                required: true,
                model: 'ReqAddTAndCModel'
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
], FaqClass.prototype, "termsAndCondition", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Admin details",
        path: '/cms',
        parameters: {
            query: {
                type: {
                    description: '1,2,3',
                    required: false,
                },
                lang: {
                    description: 'EN',
                    required: false,
                },
                userType: {
                    description: 'EN',
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
], FaqClass.prototype, "fetchTermsAndCondition", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Admin details",
        path: '/cms/list',
        parameters: {
            query: {
                lang: {
                    description: 'en',
                    required: true,
                },
                page: {
                    description: '1,',
                    required: true,
                },
                limit: {
                    description: '10',
                    required: false,
                },
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
], FaqClass.prototype, "fetchAllTermAndCondition", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Admin details",
        path: '/',
        parameters: {
            query: {
                type: {
                    description: '1,2,3',
                    required: false,
                },
                lang: {
                    description: 'EN',
                    required: false,
                },
                userType: {
                    description: 'EN',
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
], FaqClass.prototype, "getCmsDetails", null);
FaqClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/admins/faqs",
        name: "Admin faq Module",
        security: { apiKeyHeader: [] },
    }),
    __metadata("design:paramtypes", [])
], FaqClass);
exports.AdminFaqController = new FaqClass();
//# sourceMappingURL=admin.faqs.controller.js.map