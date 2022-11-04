"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyHostSession = exports.dateValidator = exports.GetUserData = exports.VerifyUserSessionOptional = exports.VerifyUserSession = void 0;
const mongoose_1 = require("mongoose");
const services_1 = require("../services");
const user_model_1 = __importDefault(require("@models/user.model"));
const user_sessions_model_1 = __importDefault(require("@models/user_sessions.model"));
const _entity_1 = require("@entity");
const _common_1 = require("@common");
const host_session_model_1 = __importDefault(require("@models/host_session.model"));
exports.VerifyUserSession = async function (req, res, next) {
    if (req.headers.authorization) {
        let authMethod = req.headers.authorization.split(" ")[0], authToken = req.headers.authorization.split(" ")[1];
        if (authMethod === 'Bearer' && authToken) {
            let decrypted = services_1.Auth.verifyToken(authToken);
            if (decrypted.success) {
                let sessionData = await user_sessions_model_1.default.findOne({ _id: mongoose_1.Types.ObjectId(decrypted.data.sessionId) });
                if (sessionData && sessionData.isActive) {
                    let userdata = await _entity_1.UserV1.findOne({ _id: sessionData.userId });
                    if (!userdata)
                        res.status(404).send({ success: false, statusCode: 404, message: 'User not found' });
                    else if (userdata.status == _common_1.ENUM.USER.STATUS.ACTIVE) {
                        res.locals.userSessionId = sessionData._id;
                        res.locals.userId = sessionData.userId;
                        res.locals.userData = userdata;
                        res.locals.deviceDetails = sessionData.device;
                        next();
                    }
                    else {
                        user_sessions_model_1.default.updateMany({ _id: mongoose_1.Types.ObjectId(decrypted.data.sessionId) }, { isActive: false });
                        res.status(403).send({ success: false, statusCode: 403, message: 'You have been blocked by the Admin.' });
                    }
                }
                else {
                    if (sessionData && !sessionData.isActive)
                        res.status(401).send({ success: false, statusCode: 401, message: 'Session expired' });
                    else
                        res.status(401).send({ success: false, statusCode: 401, message: 'Invalid Session' });
                }
            }
            else
                res.status(401).send('Invalid authorization token');
        }
        else
            res.status(400).send('Invalid authorization method');
    }
    else
        res.status(401).send('Authorization header missing');
};
exports.VerifyUserSessionOptional = async function (req, res, next) {
    if (req.headers.authorization) {
        let authMethod = req.headers.authorization.split(" ")[0], authToken = req.headers.authorization.split(" ")[1];
        if (authMethod === 'Bearer' && authToken) {
            let decrypted = services_1.Auth.verifyToken(authToken);
            if (decrypted.success) {
                let sessionData = await user_sessions_model_1.default.findOne({ _id: mongoose_1.Types.ObjectId(decrypted.data.sessionId) }).exec();
                if (sessionData && sessionData.isActive) {
                    res.locals.userSessionId = sessionData._id;
                    res.locals.userId = sessionData.userId;
                    next();
                }
                else
                    res.status(401).send({ success: false, statusCode: 201, message: 'Invalid Session or Session expired' });
            }
            else
                res.status(401).send('Invalid authorization token');
        }
        else
            res.status(400).send('Invalid authorization method');
    }
    else {
        next();
    }
};
exports.GetUserData = async function (req, res, next) {
    if (res.locals.userId) {
        let userData = await user_model_1.default.findOne({ _id: mongoose_1.Types.ObjectId(res.locals.userId) }).exec();
        if (userData) {
            res.locals.userData = userData;
            next();
        }
        else
            res.status(400).send('User not found');
    }
    else
        res.status(400).send('Invalid user authorization');
};
exports.dateValidator = async function (req, res, next) {
    var parsedstartDate = Date.parse(req.body.startDate);
    var parsedendDate = Date.parse(req.body.endDate);
    if (isNaN(parsedstartDate)) {
        res.status(400).send({ statusCode: 400, message: 'Please send valid Start Date' });
    }
    else if (isNaN(parsedendDate)) {
        res.status(400).send({ statusCode: 400, message: 'Please send valid End Date' });
    }
    else if (req.body.startDate < new Date()) {
        res.status(400).send({ statusCode: 400, message: 'Please send future Start Date' });
    }
    else if (req.body.endDate < new Date()) {
        res.status(400).send({ statusCode: 400, message: 'Please send future End Date' });
    }
    else if (req.body.endDate < req.body.startDate) {
        res.status(400).send({ statusCode: 400, message: '  End date cannot be smaller than Start Date' });
    }
    else {
        next();
    }
};
exports.VerifyHostSession = async function (req, res, next) {
    if (req.headers.authorization) {
        let authMethod = req.headers.authorization.split(" ")[0], authToken = req.headers.authorization.split(" ")[1];
        if (authMethod === 'Bearer' && authToken) {
            let decrypted = services_1.Auth.verifyToken(authToken);
            if (decrypted.success) {
                let sessionData = await host_session_model_1.default.findOne({ _id: mongoose_1.Types.ObjectId(decrypted.data.sessionId) }).exec();
                if (sessionData && sessionData.isActive) {
                    let userdata = await _entity_1.HostV1.findOne({ _id: sessionData.userId });
                    if (!userdata)
                        res.status(404).send({ success: false, statusCode: 404, message: 'User not found' });
                    else if (userdata.status == _common_1.ENUM.USER.STATUS.ACTIVE) {
                        res.locals.userSessionId = sessionData._id;
                        res.locals.userId = sessionData.userId;
                        res.locals.userData = userdata;
                        next();
                    }
                    else {
                        host_session_model_1.default.updateMany({ _id: mongoose_1.Types.ObjectId(decrypted.data.sessionId) }, { isActive: false });
                        res.status(403).send({ success: false, statusCode: 403, message: 'You have been blocked by the Admin.' });
                    }
                }
                else {
                    if (sessionData && !sessionData.isActive)
                        res.status(401).send({ success: false, statusCode: 401, message: 'Session expired' });
                    else
                        res.status(401).send({ success: false, statusCode: 401, message: 'Invalid Session' });
                }
            }
            else
                res.status(401).send('Invalid authorization token');
        }
        else
            res.status(400).send('Invalid authorization method');
    }
    else
        res.status(401).send('Authorization header missing');
};
//# sourceMappingURL=user.middleware.js.map