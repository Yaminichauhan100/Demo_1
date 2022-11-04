"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timer = exports.consumer = void 0;
const connection_1 = require("./connection");
const rabbitMQConst_1 = require("./rabbitMQConst");
const notification_model_1 = __importDefault(require("@models/notification.model"));
const _services_1 = require("@services");
const _entity_1 = require("@entity");
class Consumer {
    async startConsume() {
        connection_1.channel.consume(rabbitMQConst_1.rabbitMQConst.PUSH_NOTIFICATION_USER, async function (msg) {
            try {
                if (msg.content) {
                    let payload = msg.content.toString();
                    payload = JSON.parse(payload);
                    console.log(`${rabbitMQConst_1.rabbitMQConst.PUSH_NOTIFICATION_USER}`, payload);
                    await _services_1.PushNotification.sendAdminPush(payload.token, payload.payload);
                    await exports.timer(msg, 1000);
                    connection_1.channel.ack(msg);
                }
                return;
            }
            catch (error) {
                console.log(`${rabbitMQConst_1.rabbitMQConst.PUSH_NOTIFICATION_USER}`, error);
                return {};
            }
        }, { noAck: false });
        connection_1.channel.consume(rabbitMQConst_1.rabbitMQConst.PUSH_NOTIFICATION_HOST, async function (msg) {
            try {
                if (msg.content) {
                    let payload = msg.content.toString();
                    payload = JSON.parse(payload);
                    await _services_1.PushNotification.sendAdminPush(payload.token, payload.payload);
                    await exports.timer(msg, 1000);
                    connection_1.channel.ack(msg);
                }
                return;
            }
            catch (error) {
                console.log(`${rabbitMQConst_1.rabbitMQConst.PUSH_NOTIFICATION_HOST}`, error);
                return {};
            }
        }, { noAck: false });
        connection_1.channel.consume(rabbitMQConst_1.rabbitMQConst.DATABASE_INSERT_HOST, async function (msg) {
            try {
                if (msg.content) {
                    var payload = msg.content.toString();
                    console.log(payload);
                    let array = JSON.parse(payload);
                    console.log(`${rabbitMQConst_1.rabbitMQConst.DATABASE_INSERT_HOST}`, array);
                    await notification_model_1.default.insertMany(array);
                    await exports.timer(msg, 1000);
                    connection_1.channel.ack(msg);
                }
                return;
            }
            catch (error) {
                console.log(`${rabbitMQConst_1.rabbitMQConst.DATABASE_INSERT_HOST}`, error);
                return {};
            }
        }, { noAck: false });
        connection_1.channel.consume(rabbitMQConst_1.rabbitMQConst.DATABASE_INSERT_USER, async function (msg) {
            try {
                if (msg.content) {
                    var payload = msg.content.toString();
                    console.log(payload);
                    let array = JSON.parse(payload);
                    console.log(`${rabbitMQConst_1.rabbitMQConst.DATABASE_INSERT_HOST}`, array);
                    await notification_model_1.default.insertMany(array);
                    await exports.timer(msg, 1000);
                    connection_1.channel.ack(msg);
                }
                return;
            }
            catch (error) {
                console.log(`${rabbitMQConst_1.rabbitMQConst.DATABASE_INSERT_HOST}`, error);
                return {};
            }
        }, { noAck: false });
        connection_1.channel.consume(rabbitMQConst_1.rabbitMQConst.BULK_INSERT_DATABASE, async function (msg) {
            try {
                if (msg.content) {
                    var payload = msg.content.toString();
                    console.log(payload);
                    let array = JSON.parse(payload);
                    console.log(`${rabbitMQConst_1.rabbitMQConst.BULK_INSERT_DATABASE}`, array);
                    _entity_1.CityV1.insertMany(array);
                    await exports.timer(msg, 1000);
                    connection_1.channel.ack(msg);
                }
                return;
            }
            catch (error) {
                console.log(`${rabbitMQConst_1.rabbitMQConst.BULK_INSERT_DATABASE}`, error);
                return {};
            }
        }, { noAck: false });
        connection_1.channel.consume(rabbitMQConst_1.rabbitMQConst.INSERT_BULK_EMPLOYEE, async function (msg) {
            try {
                if (msg.content) {
                    var payload = msg.content.toString();
                    let array = JSON.parse(payload);
                    console.log("arrayarrayarrayarrayarray", array);
                    await _entity_1.PartnerV1.bulkEmployee(array.fileData, array.partnerId);
                    await exports.timer(msg, 1000);
                    connection_1.channel.ack(msg);
                }
                return;
            }
            catch (error) {
                console.log(`${rabbitMQConst_1.rabbitMQConst.BULK_INSERT_DATABASE}`, error);
                return {};
            }
        }, { noAck: false });
    }
}
exports.consumer = new Consumer();
exports.timer = (msg, time) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({});
        }, time);
    });
};
//# sourceMappingURL=consumer.js.map