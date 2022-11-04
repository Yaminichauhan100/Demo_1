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
exports.PaymentController = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const _baseController_1 = __importDefault(require("@baseController"));
const _entity_1 = require("@entity");
const stripe_1 = __importDefault(require("stripe"));
const _common_1 = require("@common");
const _common_2 = require("@common");
const uuid_1 = require("uuid");
const _builders_1 = __importDefault(require("@builders"));
const mongoose_1 = require("mongoose");
const _services_1 = require("@services");
const htmlHelper_1 = require("../../htmlHelper");
const stripe = new stripe_1.default(_common_1.CONFIG.STRIPE.SECRET_KEY, {
    apiVersion: '2020-03-02',
    typescript: true,
});
let PaymentClass = class PaymentClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async createCustomer(req, res, next) {
        try {
            let payload = req.body;
            payload.userId = res.locals.userId;
            let userData = await _entity_1.PayV1.getUserDetails(res.locals.userId);
            let setupIntent = await stripe.setupIntents.retrieve(payload.token.toString());
            let payment_method = await stripe.paymentMethods.retrieve(setupIntent.payment_method);
            let card;
            let stripeCustomerId = userData.stripeCustomerId;
            if (stripeCustomerId != undefined && stripeCustomerId != '') {
                let customer = await stripe.paymentMethods.list({ customer: stripeCustomerId, type: 'card' });
                customer.data.forEach((data) => {
                    if (data.card && data.card.fingerprint == payment_method.card.fingerprint) {
                        card = data.card;
                    }
                });
                if (!card) {
                    await stripe.paymentMethods.attach(payment_method.id, { customer: stripeCustomerId });
                    return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).CARD_LIST, setupIntent.payment_method);
                }
                else {
                    return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).CARD_EXIST, setupIntent.payment_method);
                }
            }
            else {
                payload.email = userData.email;
                let customer = {};
                customer = await this.generateCustomerId(payload);
                await stripe.paymentMethods.attach(payment_method.id, { customer: customer.id });
                await _entity_1.PayV1.updateStripeCustomerId(res.locals.userId, customer.id);
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).CARD_LIST, setupIntent.payment_method);
            }
        }
        catch (err) {
            console.error("Error", err);
            next(err);
        }
    }
    async createHostCustomer(req, res, next) {
        try {
            let payload = req.body;
            payload.userId = res.locals.userId;
            let userData = await _entity_1.PayV1.getHostDetails(res.locals.userId);
            let setupIntent = await stripe.setupIntents.retrieve(payload.token.toString());
            let payment_method = await stripe.paymentMethods.retrieve(setupIntent.payment_method);
            let card;
            let stripeCustomerId = userData.stripeCustomerId;
            if (stripeCustomerId != undefined && stripeCustomerId != '') {
                let customer = await stripe.paymentMethods.list({ customer: stripeCustomerId, type: 'card' });
                customer.data.forEach((data) => {
                    if (data.card && data.card.fingerprint == payment_method.card.fingerprint) {
                        card = data.card;
                    }
                });
                if (!card) {
                    await stripe.paymentMethods.attach(payment_method.id, { customer: stripeCustomerId });
                    return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).CARD_LIST, setupIntent.payment_method);
                }
                else {
                    return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).CARD_EXIST, setupIntent.payment_method);
                }
            }
            else {
                payload.email = userData.email;
                let customer = {};
                customer = await this.generateCustomerId(payload);
                await stripe.paymentMethods.attach(payment_method.id, { customer: customer.id });
                await _entity_1.PayV1.updateStripeHostCustomerId(res.locals.userId, customer.id);
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).CARD_LIST, setupIntent.payment_method);
            }
        }
        catch (err) {
            console.error("Error", err);
            next(err);
        }
    }
    async getCustomerCardList(req, res, next) {
        try {
            let userData = await _entity_1.PayV1.getUserDetails(res.locals.userId);
            let response = [];
            if (userData.stripeCustomerId) {
                let cardListing = await stripe.paymentMethods.list({ customer: userData.stripeCustomerId.toString(), type: 'card' });
                for (let i = 0; i < cardListing.data.length; i++) {
                    response.push({
                        id: cardListing.data[i].id,
                        brand: cardListing.data[i].card.brand,
                        country: cardListing.data[i].card.country,
                        exp_month: cardListing.data[i].card.exp_month,
                        exp_year: cardListing.data[i].card.exp_year,
                        last4: cardListing.data[i].card.last4,
                        name: cardListing.data[i].billing_details.name
                    });
                }
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).CARD_LIST, response);
            }
            else {
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).CARD_LIST, []);
            }
        }
        catch (err) {
            console.error("Error", err);
            next(err);
        }
    }
    async getHostCustomerCardList(req, res, next) {
        try {
            let userData = await _entity_1.PayV1.getHostDetails(res.locals.userId);
            let response = [];
            if (userData.stripeCustomerId) {
                let cardListing = await stripe.paymentMethods.list({ customer: userData.stripeCustomerId.toString(), type: 'card' });
                for (let i = 0; i < cardListing.data.length; i++) {
                    response.push({
                        id: cardListing.data[i].id,
                        brand: cardListing.data[i].card.brand,
                        country: cardListing.data[i].card.country,
                        exp_month: cardListing.data[i].card.exp_month,
                        exp_year: cardListing.data[i].card.exp_year,
                        last4: cardListing.data[i].card.last4,
                        name: cardListing.data[i].billing_details.name
                    });
                }
                ;
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).CARD_LIST, response);
            }
            else {
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).CARD_LIST, []);
            }
        }
        catch (err) {
            console.error("Error", err);
            next(err);
        }
    }
    async findCardByToken(payload) {
        return new Promise((resolve, reject) => {
            stripe.tokens.retrieve(payload.token.toString()).then((token) => {
                _entity_1.PayV1.insertPaymentLogs(payload.userId, JSON.stringify(token), _common_1.ENUM.PAYMENT.STATUS.SUCCESS);
                resolve(token.card);
            }).catch((error) => {
                _entity_1.PayV1.insertPaymentLogs(payload.userId, JSON.stringify(error), _common_1.ENUM.PAYMENT.STATUS.FAILURE);
                reject({});
            });
        });
    }
    async generateCustomerId(payload) {
        return new Promise((resolve, reject) => {
            stripe.customers.create({
                description: 'Customer for ' + payload.email,
                email: payload.email
            }).then((customer) => {
                _entity_1.PayV1.insertPaymentLogs(payload.userId, JSON.stringify(customer), _common_1.ENUM.PAYMENT.STATUS.SUCCESS);
                resolve(customer);
            }).catch((error) => {
                _entity_1.PayV1.insertPaymentLogs(payload.userId, JSON.stringify(error), _common_1.ENUM.PAYMENT.STATUS.FAILURE);
                reject(error);
            });
        });
    }
    async addExistingCustomerCard(userData, token) {
        return new Promise((resolve, reject) => {
            stripe.customers.createSource(userData.stripeCustomerId.toString(), { source: token }).then((card) => {
                _entity_1.PayV1.insertPaymentLogs(userData._id, JSON.stringify(card), _common_1.ENUM.PAYMENT.STATUS.SUCCESS);
                resolve(card.id);
            }).catch((err) => {
                _entity_1.PayV1.insertPaymentLogs(userData._id, JSON.stringify(err), _common_1.ENUM.PAYMENT.STATUS.FAILURE);
                reject({ err });
            });
        });
    }
    async getSetupIntent(req, res, next) {
        try {
            const setupIntent = await stripe.setupIntents.create({
                usage: 'on_session',
            });
            let responseData = {
                status: setupIntent.status,
                payment_method_options: setupIntent.payment_method_options,
                client_secret: setupIntent.client_secret
            };
            return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).CARD_LIST, responseData);
        }
        catch (error) {
            console.error("Error", error);
            next(error);
        }
    }
    async deleteCardFromStripe(req, res, next) {
        return new Promise((resolve, reject) => {
            let { cardId } = req.params;
            stripe.paymentMethods.retrieve(cardId).then((source) => {
                stripe.paymentMethods.detach(source.id).then((paymentMethod) => {
                    _entity_1.PayV1.insertPaymentLogs(res.locals.userId, JSON.stringify(source), _common_1.ENUM.PAYMENT.STATUS.SUCCESS);
                    return resolve(this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).CARD_DELETED_SUCCESSFULLY, {}));
                }).catch((error) => {
                    _entity_1.PayV1.insertPaymentLogs(res.locals.userId, JSON.stringify(error), _common_1.ENUM.PAYMENT.STATUS.FAILURE);
                    reject(error);
                });
            }).catch((error) => {
                _entity_1.PayV1.insertPaymentLogs(res.locals.userId, JSON.stringify(error), _common_1.ENUM.PAYMENT.STATUS.FAILURE);
                reject(error);
            });
        });
    }
    async deleteHostCardFromStripe(req, res, next) {
        return new Promise((resolve, reject) => {
            let { cardId } = req.params;
            stripe.paymentMethods.retrieve(cardId).then((source) => {
                stripe.paymentMethods.detach(source.id).then((paymentMethod) => {
                    _entity_1.PayV1.insertPaymentLogs(res.locals.userId, JSON.stringify(source), _common_1.ENUM.PAYMENT.STATUS.SUCCESS);
                    return resolve(this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).CARD_DELETED_SUCCESSFULLY, {}));
                }).catch((error) => {
                    _entity_1.PayV1.insertPaymentLogs(res.locals.userId, JSON.stringify(error), _common_1.ENUM.PAYMENT.STATUS.FAILURE);
                    reject(error);
                });
            }).catch((error) => {
                _entity_1.PayV1.insertPaymentLogs(res.locals.userId, JSON.stringify(error), _common_1.ENUM.PAYMENT.STATUS.FAILURE);
                reject(error);
            });
        });
    }
    async editCard(req, res, next) {
        return new Promise((resolve, reject) => {
            let { cardId, exp_month, exp_year } = req.body;
            stripe.paymentMethods.update(cardId, {
                card: {
                    exp_month: exp_month,
                    exp_year: exp_year
                }
            }).then((card) => {
                _entity_1.PayV1.insertPaymentLogs(res.locals.userId, JSON.stringify(card), _common_1.ENUM.PAYMENT.STATUS.SUCCESS);
                return resolve(this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).UPDATE_CARD, card));
            }).catch((error) => {
                _entity_1.PayV1.insertPaymentLogs(res.locals.userId, JSON.stringify(error), _common_1.ENUM.PAYMENT.STATUS.FAILURE);
                reject(next(error));
            });
        });
    }
    async makePayment(req, res, next) {
        try {
            let userData = await _entity_1.PayV1.getUserDetails(res.locals.userId);
            let payload = req.body;
            payload.userId = res.locals.userId;
            let last4 = await this.getCustomerCards(payload.userId, payload.cardId);
            payload.cardDigit = last4;
            let booking = await _entity_1.BookingV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.bookingId) });
            await _entity_1.UserV1.updateOne({ _id: res.locals.userId }, { $inc: { bookingCount: 1 } });
            if ((booking === null || booking === void 0 ? void 0 : booking.prolongedStatus) === _common_1.ENUM.BOOKING.PROLONGED_STATUS.PENDING
                && (booking === null || booking === void 0 ? void 0 : booking.prolongBookingId)) {
                await _entity_1.BookingV1.updateOne({ _id: mongoose_1.Types.ObjectId(booking === null || booking === void 0 ? void 0 : booking.prolongBookingId) }, {
                    $set: {
                        prolongedStatus: _common_1.ENUM.BOOKING.PROLONGED_STATUS.SUCCESS,
                        prolongBookingId: mongoose_1.Types.ObjectId(booking === null || booking === void 0 ? void 0 : booking.prolongBookingId)
                    }
                }, {});
            }
            if (booking.giftCardNo) {
                const totalPayable = await _entity_1.GiftV1.updateGiftCardRedemption(payload, booking);
                if (await _services_1.roundOffNumbers(totalPayable) <= 0.5) {
                    return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).AMOUNT_TOO_SMALL);
                }
                let paymentIntent = await stripe.paymentIntents.create({
                    amount: payload.paymentPlan === _common_1.ENUM.PAYMENT.PLAN.MONTHLY ?
                        Math.trunc(await _services_1.roundOffNumbers(booking === null || booking === void 0 ? void 0 : booking.monthlyPayable) * 100) :
                        Math.trunc(await _services_1.roundOffNumbers(totalPayable) * 100),
                    currency: 'eur',
                    payment_method_types: ['card'],
                    payment_method: payload.cardId,
                    customer: userData.stripeCustomerId.toString()
                }, {
                    idempotencyKey: uuid_1.v4()
                });
                await stripe.paymentIntents.confirm(paymentIntent === null || paymentIntent === void 0 ? void 0 : paymentIntent.id, { payment_method: paymentIntent === null || paymentIntent === void 0 ? void 0 : paymentIntent.payment_method });
                if (payload.paymentPlan === _common_1.ENUM.PAYMENT.PLAN.MONTHLY) {
                    await _entity_1.PayV1.updateRecurringModel(booking);
                }
                await Promise.all([
                    _entity_1.PayV1.insertPaymentLogs(res.locals.userId, JSON.stringify(paymentIntent), _common_1.ENUM.PAYMENT.STATUS.SUCCESS),
                    _entity_1.PayV1.updateBooking(payload, paymentIntent, booking, req),
                    _services_1.Slack.postMessageToSlackUser(booking.propertyData.hostEmail, booking),
                ]);
                if (!(payload === null || payload === void 0 ? void 0 : payload.savedCard) && payload.savedCard == false) {
                    await this.deleteCard(payload.cardId, payload.userId);
                }
                return await this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).PAYMENT_SUCCESFULL, paymentIntent);
            }
            else {
                if (await _services_1.roundOffNumbers(booking.totalPayable) <= 0.5) {
                    return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).AMOUNT_TOO_SMALL);
                }
                let paymentIntent = await stripe.paymentIntents.create({
                    amount: payload.paymentPlan === _common_1.ENUM.PAYMENT.PLAN.MONTHLY ?
                        Math.trunc(await _services_1.roundOffNumbers(booking === null || booking === void 0 ? void 0 : booking.monthlyPayable) * 100) :
                        Math.trunc(await _services_1.roundOffNumbers(booking === null || booking === void 0 ? void 0 : booking.totalPayable) * 100),
                    currency: 'eur',
                    payment_method_types: ['card'],
                    payment_method: payload.cardId,
                    customer: userData.stripeCustomerId.toString()
                }, {
                    idempotencyKey: uuid_1.v4()
                });
                await stripe.paymentIntents.confirm(paymentIntent === null || paymentIntent === void 0 ? void 0 : paymentIntent.id, { payment_method: paymentIntent === null || paymentIntent === void 0 ? void 0 : paymentIntent.payment_method });
                if (payload.paymentPlan === _common_1.ENUM.PAYMENT.PLAN.MONTHLY) {
                    await _entity_1.PayV1.updateRecurringModel(booking);
                }
                await Promise.all([
                    _entity_1.PayV1.insertPaymentLogs(res.locals.userId, JSON.stringify(paymentIntent), _common_1.ENUM.PAYMENT.STATUS.SUCCESS),
                    _entity_1.PayV1.updateBooking(payload, paymentIntent, booking, req),
                    _services_1.Slack.postMessageToSlackUser(booking.propertyData.hostEmail, booking)
                ]);
                if (!(payload === null || payload === void 0 ? void 0 : payload.savedCard) && payload.savedCard == false) {
                    await this.deleteCard(payload.cardId, payload.userId);
                }
                return await this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).PAYMENT_SUCCESFULL, paymentIntent);
            }
        }
        catch (error) {
            console.error("we have an error ==>", error);
            _entity_1.PayV1.insertPaymentLogs(res.locals.userId, JSON.stringify(error), _common_1.ENUM.PAYMENT.STATUS.FAILURE);
            next(error);
        }
    }
    async make3DPayment(req, res, next) {
        try {
            let payload = req.body;
            payload.userId = res.locals.userId;
            let last4 = await this.getCustomerCards(payload.userId, payload.cardId);
            payload.cardDigit = last4;
            let booking = await _entity_1.BookingV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.bookingId) });
            await Promise.all([
                _entity_1.PayV1.insertPaymentLogs(res.locals.userId, JSON.stringify(payload.data), _common_1.ENUM.PAYMENT.STATUS.SUCCESS),
                _entity_1.PayV1.updateBooking(payload, payload.data, booking, req)
            ]);
            if (payload.savedCard == false)
                this.deleteCard(payload.cardId, payload.userId);
            return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).PAYMENT_SUCCESFULL, payload.data);
        }
        catch (error) {
            console.error("Error", error);
            next(error);
        }
    }
    async paymentListing(req, res, next) {
        try {
            let payload = req.query;
            payload.userId = res.locals.userId;
            let pipeline = await _builders_1.default.User.PaymentBuilder.GetPaymentListing(payload);
            payload.getCount = true;
            let details = await _entity_1.PayV1.paginateAggregate(pipeline, payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, details);
        }
        catch (error) {
            console.error("Error", error);
            next(error);
        }
    }
    async makeStripeConnection(req, res, next) {
        try {
            let userData = await _entity_1.PayV1.getUserDetails(res.locals.userId);
            let payload = req.body;
            payload.userId = res.locals.userId;
            return new Promise((resolve, reject) => {
                stripe.oauth.token({
                    grant_type: payload.grant_type,
                    code: payload.code
                }).then((oauth) => {
                    userData.stripeAccountId = oauth.stripe_user_id;
                    _entity_1.UserV1.updateDocument({ _id: payload.userId }, { stripeAccountId: oauth.stripe_user_id });
                    return resolve(this.sendResponse(res, _common_1.SUCCESS.DEFAULT, oauth));
                }).catch((error) => {
                    reject(next(error));
                });
            });
        }
        catch (error) {
            console.error("Error", error);
            next(error);
        }
    }
    async disconnectAccount(req, res, next) {
        try {
            let hostData = await _entity_1.PayV1.getHostDetails(res.locals.userId);
            return new Promise((resolve, reject) => {
                stripe.accounts.del(hostData.stripeAccountId.toString()).then((result) => {
                    _entity_1.HostV1.updateWithDeleteDocument({ _id: mongoose_1.Types.ObjectId(res.locals.userId) }, { stripeAccountStatus: _common_1.CONSTANT.STATUS.DELETED }, { stripeAccountId: "" });
                    return resolve(this.sendResponse(res, _common_1.SUCCESS.DEFAULT, result));
                }).catch((error) => {
                    reject(next(error));
                });
            });
        }
        catch (error) {
            console.error("Error", error);
            next(error);
        }
    }
    async createPayout(req, res, next) {
        try {
            let payload = req.body;
            let userData = await _entity_1.HostV1.findOne({ _id: payload.userId }, {});
            let payoutDate = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
            if (userData && userData.hasOwnProperty("lastPayoutDate")) {
                if (userData.lastPayoutDate != payoutDate || userData.lastPayoutDate > payoutDate)
                    return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).PAYOUT_ALREADY_CREATED);
            }
            return new Promise((resolve, reject) => {
                stripe.payouts.create({
                    amount: payload.amount,
                    currency: payload.currency
                }).then((payouts) => {
                    _entity_1.HostV1.updateDocument({ _id: payload.userId }, { lastPayoutDate: new Date() });
                    return resolve(this.sendResponse(res, _common_1.SUCCESS.DEFAULT, payouts));
                }).catch((error) => {
                    reject(next(error));
                });
            });
        }
        catch (error) {
            console.error("Error", error);
            next(error);
        }
    }
    async getPayoutList(req, res, next) {
        try {
            let payload = req.params;
            payload.userId = res.locals.userId;
            return new Promise((resolve, reject) => {
                stripe.payouts.retrieve(payload.payoutId).then((payouts) => {
                    return resolve(this.sendResponse(res, _common_1.SUCCESS.DEFAULT, payouts));
                }).catch((error) => {
                    reject(next(error));
                });
            });
        }
        catch (error) {
            console.error("Error", error);
            next(error);
        }
    }
    async getAllPayoutList(req, res, next) {
        try {
            return new Promise((resolve, reject) => {
                stripe.payouts.list({}).then((payouts) => {
                    return resolve(this.sendResponse(res, _common_1.SUCCESS.DEFAULT, payouts));
                }).catch((error) => {
                    reject(next(error));
                });
            });
        }
        catch (error) {
            console.error("Error", error);
            next(error);
        }
    }
    async updatePayoutListing(req, res, next) {
        try {
            let bookingData = await _entity_1.BookingV1.getPayoutData();
            for (let data = 0; data < bookingData.length; data++) {
                let payoutAmount = bookingData[data].totalPayable - (bookingData[data].totalPayable * .20);
                let adminAmount = bookingData[data].totalPayable * .20;
                let payoutData = await _entity_1.PayoutV1.findOne({ hostId: mongoose_1.Types.ObjectId(bookingData[data].hostId) }, { adminCommissionAmount: 1, hostAmount: 1 });
                await _entity_1.PayoutV1.updateOne({ hostId: mongoose_1.Types.ObjectId(bookingData[data].hostId) }, {
                    hostId: mongoose_1.Types.ObjectId(bookingData[data].hostId),
                    adminCommissionAmount: payoutData ? payoutData.adminCommissionAmount + adminAmount : adminAmount,
                    hostAmount: payoutData ? payoutData.hostAmount + payoutAmount : payoutAmount,
                    status: _common_1.ENUM.PAYOUT.STATUS.PENDING,
                    payoutId: _services_1.generateUniqueId('DSKPAY'),
                    $addToSet: { bookingId: mongoose_1.Types.ObjectId(bookingData[data]._id) },
                }, { upsert: true });
            }
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
        }
        catch (error) {
            console.error("Error", error);
            next(error);
        }
    }
    async deleteCard(cardId, userId) {
        return new Promise((resolve, reject) => {
            stripe.paymentMethods.retrieve(cardId).then((source) => {
                stripe.paymentMethods.detach(source.id).then((paymentMethod) => {
                    _entity_1.PayV1.insertPaymentLogs(userId, JSON.stringify(source), _common_1.ENUM.PAYMENT.STATUS.SUCCESS);
                    return resolve();
                }).catch((error) => {
                    _entity_1.PayV1.insertPaymentLogs(userId, JSON.stringify(error), _common_1.ENUM.PAYMENT.STATUS.FAILURE);
                    reject(error);
                });
            }).catch((error) => {
                _entity_1.PayV1.insertPaymentLogs(userId, JSON.stringify(error), _common_1.ENUM.PAYMENT.STATUS.FAILURE);
                reject(error);
            });
        });
    }
    async getCustomerCards(payload, cardId) {
        let userData = await _entity_1.PayV1.getUserDetails(payload);
        let response;
        let cardListing = await stripe.paymentMethods.list({ customer: userData.stripeCustomerId.toString(), type: 'card' });
        for (let i = 0; i < cardListing.data.length; i++) {
            if (cardListing.data[i].id == cardId)
                response = cardListing.data[i].card.last4;
        }
        return response;
    }
    async getHostCustomerCards(payload, cardId) {
        let userData = await _entity_1.PayV1.getHostDetails(payload);
        let response;
        let cardListing = await stripe.paymentMethods.list({ customer: userData.stripeCustomerId.toString(), type: 'card' });
        for (let i = 0; i < cardListing.data.length; i++) {
            if (cardListing.data[i].id == cardId)
                response = cardListing.data[i].card.last4;
        }
        return response;
    }
    async hostPaymentListing(req, res, next) {
        try {
            let payload = req.query;
            payload['userId'] = res.locals.userId;
            payload['userData'] = res.locals.userData;
            let pipeline = await _builders_1.default.User.PaymentBuilder.GetHostPaymentListing(payload);
            let pipelineList = await _builders_1.default.User.PaymentBuilder.GetPaymentCountListing(payload);
            payload['getCount'] = true;
            let details = await _entity_1.PayV1.paginateAggregate(pipeline, payload);
            let paymentCountDetails = await _entity_1.PayV1.basicAggregate(pipelineList);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, { details: details, paymentCount: paymentCountDetails });
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async redirectUrl(req, res, next) {
        try {
            let payload = req.query;
            return new Promise((resolve, reject) => {
                stripe.oauth.token({
                    grant_type: 'authorization_code',
                    code: payload.code
                }).then((oauth) => {
                    _entity_1.HostV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.state) }, { stripeAccountId: oauth.stripe_user_id });
                    res.redirect(`/api/payment/stripe-connect-success?id=${oauth.stripe_user_id}`);
                }).catch((error) => {
                    reject(next(error));
                });
            });
        }
        catch (error) {
            next(error);
        }
    }
    async stripeConnectSuccess(req, res, next) {
        try {
            let getHostDetails = await _entity_1.HostV1.findOne({ stripeAccountId: req.query.id });
            const hostName = (getHostDetails === null || getHostDetails === void 0 ? void 0 : getHostDetails.name) ? getHostDetails === null || getHostDetails === void 0 ? void 0 : getHostDetails.name : "";
            let hostHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/stripeSuccess.html", {
                hostName: hostName,
                logo: _common_1.CONSTANT.PAM_LOGO,
                redirectUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowhoststg.appskeeper.com` : `${_common_1.WEB_PANELS.HOST_PANEL_PROD}`,
                igLogo: _common_1.CONSTANT.INSTAGRAM_LOGO,
                twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.HOST_PANEL_STAGING : _common_1.WEB_PANELS.HOST_PANEL_PROD,
                CONTACT_US: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_HOST_STAGING : _common_1.WEB_PANELS.CONTACT_US_PAM_PROD,
                FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_HOST_STAGING : _common_1.WEB_PANELS.FAQ_PAM_PROD,
                facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
            });
            return res.send(hostHtml);
        }
        catch (error) {
            console.error("Error", error);
            next(error);
        }
    }
    async stripeConnectAccountDetail(req, res, next) {
        try {
            let userData = await _entity_1.PayV1.getHostDetails(res.locals.userId);
            if (userData.stripeAccountId) {
                return new Promise((resolve, reject) => {
                    stripe.accounts.retrieve(userData.stripeAccountId.toString()).then((details) => {
                        var _a, _b, _c, _d;
                        console.log("details. ext------>", details.external_accounts);
                        console.log("details. ext------>", details);
                        let response = {};
                        response['accountId'] = details.id;
                        response['country'] = details.country;
                        response['email'] = details.email;
                        response['currency'] = details.default_currency;
                        response['payoutStatus'] = details.payouts_enabled;
                        response['verifiedReason'] = details.payouts_enabled;
                        if ((_a = details.requirements) === null || _a === void 0 ? void 0 : _a.disabled_reason) {
                            response['disableReason'] = details.requirements.disabled_reason;
                        }
                        else {
                            response['disableReason'] = '';
                        }
                        if ((_b = details.business_profile) === null || _b === void 0 ? void 0 : _b.name) {
                            response['name'] = details.business_profile.name;
                        }
                        else {
                            response['name'] = '';
                        }
                        if ((_c = details.external_accounts) === null || _c === void 0 ? void 0 : _c.data[0]) {
                            let bankData = (_d = details.external_accounts) === null || _d === void 0 ? void 0 : _d.data[0];
                            response['bankName'] = bankData === null || bankData === void 0 ? void 0 : bankData.bank_name;
                        }
                        else {
                            response['bankName'] = '';
                        }
                        response['swiftCode'] = '';
                        return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
                    }).catch((error) => {
                        console.error(`we have an error ==> ${error}`);
                        reject(next(error));
                    });
                });
            }
            else {
                return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
            }
            res.sendFile(process.cwd() + "/src/views/stripeSuccess.html");
        }
        catch (error) {
            console.error("Error", error);
            next(error);
        }
    }
    async makeGiftCardPayment(req, res, next) {
        try {
            let userData = res.locals.userData;
            let payload = req.body;
            payload.userId = res.locals.userId;
            let last4 = await this.getCustomerCards(payload.userId, payload.cardId);
            let transactionDetails = {};
            let giftCardDetail = await _entity_1.GiftV1.findOne({ giftCardNo: payload.giftCardNo });
            let paymentIntent = await stripe.paymentIntents.create({
                amount: parseInt(giftCardDetail.amount) * 100,
                currency: 'EUR',
                payment_method_types: ['card'],
                payment_method: payload.cardId,
                customer: userData.stripeCustomerId.toString()
            }, {
                idempotencyKey: uuid_1.v4()
            });
            await stripe.paymentIntents.confirm(paymentIntent === null || paymentIntent === void 0 ? void 0 : paymentIntent.id, { payment_method: paymentIntent === null || paymentIntent === void 0 ? void 0 : paymentIntent.payment_method });
            transactionDetails.transactionId = _services_1.generateUniqueId('DSKTR');
            transactionDetails.stripeTransactionId = paymentIntent.id;
            transactionDetails.last4 = last4;
            transactionDetails.paymentMethod = 'card';
            let html = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/gift-card.html", {
                url: `${_common_2.BASE.APP_URL}`,
                from: giftCardDetail.from,
                logo: _common_1.CONSTANT.VERIFY_EMAIL_LOGO,
                facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                mockpur: _common_1.CONSTANT.MOCKUPER_6,
                appStore: _common_1.CONSTANT.APP_STORE_BADGE,
                googlePlay: _common_1.CONSTANT.GOOGLE_PLAY_BADGE,
                igLogo: _common_1.CONSTANT.INSTAGRAM_LOGO,
                twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                amount: _services_1.formatPrice(giftCardDetail.amount),
                userName: res.locals.userData.name,
                giftCardNo: giftCardDetail.giftCardNo,
                giftCardPin: giftCardDetail.giftCardPin,
                giftCardLogo: _common_1.CONSTANT.GIFT_CARD_LOGO,
                giftCardBG: _common_1.CONSTANT.GIFT_CARD_BG,
                redirectUrl: process.env.NODE_ENV == 'staging' ? _common_1.WEB_PANELS.USER_PANEL_STAGING : _common_1.WEB_PANELS.USER_PANEL_PROD,
                webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.USER_PANEL_STAGING : _common_1.WEB_PANELS.USER_PANEL_PROD,
                contactUsUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_STAGING : _common_1.WEB_PANELS.CONTACT_US_PROD,
                FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_STAGING : _common_1.WEB_PANELS.FAQ_PROD
            });
            await Promise.all([
                _entity_1.PayV1.insertPaymentLogs(res.locals.userId, JSON.stringify(paymentIntent), _common_1.ENUM.PAYMENT.STATUS.SUCCESS),
                _entity_1.GiftV1.updateDocument({ giftCardNo: payload.giftCardNo }, {
                    paymentStatus: _common_1.ENUM.PAYMENT.STATUS.SUCCESS,
                    transactionDetails: transactionDetails,
                    validity: _services_1.fiveYearsFromNow()
                }),
                _services_1.emailService.sendGiftCard(html, giftCardDetail.to, _services_1.formatPrice(giftCardDetail.amount), res.locals.userData.name)
            ]);
            if (payload.savedCard != undefined && payload.savedCard == false)
                this.deleteCard(payload.cardId, payload.userId);
            return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).PAYMENT_SUCCESFULL, paymentIntent);
        }
        catch (error) {
            console.error("Error", error);
            _entity_1.PayV1.insertPaymentLogs(res.locals.userId, JSON.stringify(error), _common_1.ENUM.PAYMENT.STATUS.FAILURE);
            next(error);
        }
    }
    async createPromotionPayment(req, res, next) {
        var _a, _b, _c, _d, _e, _f;
        try {
            let userData = res.locals.userData;
            let payload = req.body;
            payload['userId'] = res.locals.userId;
            let last4 = await this.getHostCustomerCards(payload.userId, payload.cardId);
            let transactionDetail = {};
            let promotionDetail = await _entity_1.PromotionV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.promotionId) });
            let paymentIntent = await stripe.paymentIntents.create({
                amount: parseInt((_a = promotionDetail === null || promotionDetail === void 0 ? void 0 : promotionDetail.transactionDetail) === null || _a === void 0 ? void 0 : _a.totalPrice) * 100,
                currency: 'EUR',
                payment_method_types: ['card'],
                payment_method: payload.cardId,
                customer: userData.stripeCustomerId.toString()
            }, {
                idempotencyKey: uuid_1.v4()
            });
            await stripe.paymentIntents.confirm(paymentIntent === null || paymentIntent === void 0 ? void 0 : paymentIntent.id, { payment_method: paymentIntent === null || paymentIntent === void 0 ? void 0 : paymentIntent.payment_method });
            transactionDetail['transactionId'] = _services_1.generateUniqueId('DSKTR');
            transactionDetail['stripeTransactionId'] = paymentIntent.id;
            transactionDetail['last4'] = last4;
            transactionDetail['transactionMethod'] = 'card';
            transactionDetail['transactionStatus'] = _common_1.ENUM.PAYMENT.STATUS.SUCCESS;
            transactionDetail['price'] = (_b = promotionDetail === null || promotionDetail === void 0 ? void 0 : promotionDetail.transactionDetail) === null || _b === void 0 ? void 0 : _b.price;
            transactionDetail['totalPrice'] = (_c = promotionDetail === null || promotionDetail === void 0 ? void 0 : promotionDetail.transactionDetail) === null || _c === void 0 ? void 0 : _c.totalPrice;
            transactionDetail['tax'] = (_d = promotionDetail === null || promotionDetail === void 0 ? void 0 : promotionDetail.transactionDetail) === null || _d === void 0 ? void 0 : _d.tax;
            transactionDetail['taxPercentage'] = (_e = promotionDetail === null || promotionDetail === void 0 ? void 0 : promotionDetail.transactionDetail) === null || _e === void 0 ? void 0 : _e.taxPercentage;
            transactionDetail['dailyPrice'] = (_f = promotionDetail === null || promotionDetail === void 0 ? void 0 : promotionDetail.transactionDetail) === null || _f === void 0 ? void 0 : _f.dailyPrice;
            await Promise.all([
                _entity_1.PayV1.insertPaymentLogs(res.locals.userId, JSON.stringify(paymentIntent), _common_1.ENUM.PAYMENT.STATUS.SUCCESS),
                _entity_1.PromotionV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.promotionId) }, {
                    transactionDetail: transactionDetail,
                    promotionStatus: _common_1.ENUM.PROPERTY.PROMOTION_STATUS.UPCOMING
                }),
                _entity_1.PayV1.updatePromotionStatus(promotionDetail)
            ]);
            await _services_1.GeneratePdf.advInvoice(payload.promotionId);
            if (payload.savedCard != undefined && payload.savedCard == false)
                this.deleteCard(payload.cardId, payload.userId);
            return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).PAYMENT_SUCCESFULL, paymentIntent);
        }
        catch (error) {
            console.error("Error", error);
            _entity_1.PayV1.insertPaymentLogs(res.locals.userId, JSON.stringify(error), _common_1.ENUM.PAYMENT.STATUS.FAILURE);
            next(error);
        }
    }
    async appplyGiftCard(req, res, next) {
        try {
            let payload = req.params;
            let amountPayableAfterDiscount;
            let reamaningAmount;
            payload.userId = res.locals.userId;
            let giftcard = await Promise.all([_entity_1.GiftV1.findOne({ giftCardNo: payload.giftCardNo }), _entity_1.BookingV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.bookingId) })]);
            if (!giftcard[0])
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).GIFTCARD_NOT_FOUND);
            if (giftcard[1].totalPayable > giftcard[0].amount) {
                amountPayableAfterDiscount = giftcard[1].totalPayable - giftcard[0].amount;
                reamaningAmount = 0;
            }
            else {
                amountPayableAfterDiscount = giftcard[0].amountPayableAfterDiscount - giftcard[1].totalPayable;
                reamaningAmount = amountPayableAfterDiscount;
            }
            _entity_1.BookingV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.bookingId) }, { totalPayable: amountPayableAfterDiscount, reamaningAmount: reamaningAmount });
            return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).GIFTCARD_APPLIED);
        }
        catch (error) {
            console.error("Error", error);
            next(error);
        }
    }
    async fetchPlan(req, res, next) {
        try {
            let payload = req.query;
            let response = await _entity_1.PayV1.fetchPaymentPlans(payload.bookingId);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async initiateRecurringPayments(req, res, next) {
        try {
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async refund(bookingId, amountToRefund) {
        try {
            let transactionData = await _entity_1.PayV1.getTransactionData(bookingId);
            if (transactionData) {
                return new Promise((resolve, reject) => {
                    stripe.refunds.create({
                        payment_intent: transactionData.stripeTransactionId,
                        amount: Math.round(transactionData.price * 100),
                    }).then((data) => {
                        _entity_1.PayV1.insertPaymentLogs(transactionData.userId, JSON.stringify(data), _common_1.ENUM.PAYMENT.STATUS.SUCCESS);
                        return resolve(_common_1.ENUM.PAYMENT.STATUS.SUCCESS);
                    }).catch((error) => {
                        _entity_1.PayV1.insertPaymentLogs(transactionData === null || transactionData === void 0 ? void 0 : transactionData.userId, JSON.stringify(error), _common_1.ENUM.PAYMENT.STATUS.FAILURE);
                        console.error(`we have an error while initiating refund ==> ${error}`);
                        reject(error);
                    });
                });
            }
            else {
            }
        }
        catch (error) {
            console.error(`we have an error while refund ${error}`);
            throw error;
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Toggle host notification control",
        path: '/add/card',
        parameters: {
            body: {
                description: 'Body for update toggle notification',
                required: true,
                model: 'ReqAddCardModel'
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
], PaymentClass.prototype, "createCustomer", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "subject",
        path: '/customer/card/list',
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
], PaymentClass.prototype, "getCustomerCardList", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "subject",
        path: '/setup/intent',
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
], PaymentClass.prototype, "getSetupIntent", null);
__decorate([
    swagger_express_ts_1.ApiOperationDelete({
        description: "User Delete",
        path: '/card/{cardId}',
        parameters: {
            path: {
                cardId: {
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
], PaymentClass.prototype, "deleteCardFromStripe", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Toggle host notification control",
        path: '/create/payment',
        parameters: {
            body: {
                description: 'Body for add payment',
                required: true,
                model: 'ReqAddPaymentModel'
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
], PaymentClass.prototype, "makePayment", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Toggle host notification control",
        path: '/create/3Dpayment',
        parameters: {
            body: {
                description: 'Body for add payment',
                required: true,
                model: 'ReqAdd3DPaymentModel'
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
], PaymentClass.prototype, "make3DPayment", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "subject",
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
                toDate: {
                    description: '2020-03-01T10:30:49.426Z',
                    required: false,
                },
                fromDate: {
                    description: '2021-04-01T10:30:49.426Z',
                    required: false,
                },
                minAmount: {
                    description: '0',
                    required: false,
                },
                maxAmount: {
                    description: '100',
                    required: false,
                },
                status: {
                    description: 'completed/cancelled',
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
], PaymentClass.prototype, "paymentListing", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "subject",
        path: '/host/listing',
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
                toDate: {
                    description: '2020-03-01T10:30:49.426Z',
                    required: false,
                },
                fromDate: {
                    description: '2021-04-01T10:30:49.426Z',
                    required: false,
                },
                cityId: {
                    description: 'city Id',
                    required: false,
                },
                stateId: {
                    description: 'city Id',
                    required: false,
                },
                countryId: {
                    description: 'city Id',
                    required: false,
                },
                status: {
                    description: 'completed/cancelled',
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
                propertyIds: {
                    description: '[mongoId]',
                    required: false,
                },
                paymentStatus: {
                    description: '1,2,3',
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
], PaymentClass.prototype, "hostPaymentListing", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Toggle host notification control",
        path: '/create/gift-payment',
        parameters: {
            body: {
                description: 'Body for add payment',
                required: true,
                model: 'ReqAddGiftPaymentModel'
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
], PaymentClass.prototype, "makeGiftCardPayment", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "View Plan",
        path: '/host/viewPlan?',
        parameters: {
            query: {
                bookingId: {
                    description: 'bookingId type mongoId',
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
], PaymentClass.prototype, "fetchPlan", null);
PaymentClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/payment",
        name: "Payment Module",
        security: { apiKeyHeader: [] },
    }),
    __metadata("design:paramtypes", [])
], PaymentClass);
exports.PaymentController = new PaymentClass();
//# sourceMappingURL=payment.controller.js.map