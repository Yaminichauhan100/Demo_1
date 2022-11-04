"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rabbitMQ = exports.channel = void 0;
const rabbitMQConst_1 = require("./rabbitMQConst");
const _common_1 = require("@common");
const amqp = require('amqplib');
const consumer_1 = require("./consumer");
class RabbitMQ {
    async createConnection() {
        try {
            let connection = await amqp.connect(_common_1.CONFIG.AMQP_URL);
            console.log("rabbitMQ server connected");
            exports.channel = await connection.createChannel();
            exports.channel.assertQueue(rabbitMQConst_1.rabbitMQConst.PUSH_NOTIFICATION_USER, {
                durable: true
            });
            exports.channel.assertQueue(rabbitMQConst_1.rabbitMQConst.PUSH_NOTIFICATION_HOST, {
                durable: true
            });
            exports.channel.assertQueue(rabbitMQConst_1.rabbitMQConst.DATABASE_INSERT_USER, {
                durable: true
            });
            exports.channel.assertQueue(rabbitMQConst_1.rabbitMQConst.DATABASE_INSERT_HOST, {
                durable: true
            });
            exports.channel.assertQueue(rabbitMQConst_1.rabbitMQConst.BULK_INSERT_DATABASE, {
                durable: true
            });
            exports.channel.assertQueue(rabbitMQConst_1.rabbitMQConst.INSERT_BULK_EMPLOYEE, {
                durable: true
            });
            consumer_1.consumer.startConsume();
            exports.channel.prefetch(1);
            return exports.channel;
        }
        catch (error) {
            console.error(`we have an error connecting rabbitMq ==> ${error}`);
        }
    }
}
exports.rabbitMQ = new RabbitMQ();
//# sourceMappingURL=connection.js.map