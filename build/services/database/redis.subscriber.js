"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribe = void 0;
const redis_1 = __importDefault(require("redis"));
const _common_1 = require("@common");
const _entity_1 = require("@entity");
const mongoose_1 = require("mongoose");
const _controllers_1 = require("@controllers");
const options = {};
options['db'] = _common_1.CONFIG.REDIS_INDEX;
options['host'] = _common_1.CONFIG.REDIS_HOST;
options['port'] = _common_1.CONFIG.REDIS_PORT;
const sub = redis_1.default.createClient(options);
exports.subscribe = async (channel) => {
    try {
        sub.subscribe(channel);
        console.log(`subscribed to channel ===> ${channel}`);
        return {};
    }
    catch (error) {
        console.log("Error while subscribing to a channel", error);
        return {};
    }
};
sub.on('message', async (channel, message) => {
    try {
        const subscriptionKey = message.split("_")[0];
        const redisKeyId = message.split("_")[1];
        switch (subscriptionKey) {
            case _common_1.ENUM.REDIS.PENDING_BOOKING:
                await Promise.all([
                    _entity_1.BookingV1.updateOne({
                        _id: mongoose_1.Types.ObjectId(redisKeyId),
                        bookingStatus: _common_1.ENUM.BOOKING.STATUS.PENDING
                    }, { $set: { bookingStatus: _common_1.ENUM.BOOKING.STATUS.REJECTED } }),
                    _controllers_1.PaymentController.refund(redisKeyId, {}),
                    _entity_1.UserV1.sendAutoRejectPush(redisKeyId)
                ]);
                break;
            case (_common_1.ENUM.PROPERTY.PROMOTION_FLAG.START).toString():
                _entity_1.PromotionV1.startPromotion(redisKeyId);
                break;
            case (_common_1.ENUM.PROPERTY.PROMOTION_FLAG.END).toString():
                _entity_1.PromotionV1.endPromotion(redisKeyId);
                break;
        }
    }
    catch (error) {
        console.error("error while listening to channel", error);
    }
});
//# sourceMappingURL=redis.subscriber.js.map