"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisDOA = void 0;
const redis_1 = __importDefault(require("redis"));
const _common_1 = require("@common");
const util_1 = require("util");
const _services_1 = require("@services");
class Redis {
    constructor() {
    }
    async connectRedisDB() {
        try {
            let options = {};
            if (_common_1.CONFIG.NODE_ENV !== "prod") {
                options['db'] = _common_1.CONFIG.REDIS_INDEX;
                options['host'] = _common_1.CONFIG.REDIS_HOST;
                options['port'] = _common_1.CONFIG.REDIS_PORT;
                this.client = redis_1.default.createClient(options);
                this.client.select(_common_1.CONFIG.REDIS_INDEX);
                this.client.config('set', 'notify-keyspace-events', 'AKE');
            }
            options['host'] = _common_1.CONFIG.REDIS_HOST;
            options['port'] = _common_1.CONFIG.REDIS_PORT;
            this.client = redis_1.default.createClient(options);
            console.table(options);
        }
        catch (error) {
            console.error(`Error in connecting to redis ==> ${error}`);
            process.exit(_common_1.SYS_ERR.REDIS_CONN_FAILED);
        }
    }
    async setKey(key, value) {
        return new Promise((res, rej) => {
            this.client.set(key, value, (err, reply) => {
                if (err)
                    rej(err);
                else
                    res(reply);
            });
        });
    }
    async insertKeyInRedis(key, value) {
        try {
            let set = util_1.promisify(this.client.set).bind(this.client);
            await set(key, value);
            _services_1.logger(`data inserted ==> ${key}`);
            return {};
        }
        catch (error) {
            console.error(`we have an error while inserting key and value ==> ${error}`);
            return Promise.reject(error);
        }
    }
    async getKeyFromRedis(key) {
        try {
            let get = util_1.promisify(this.client.get).bind(this.client);
            let data = await get(key);
            _services_1.logger(`data found ==> ${data}`);
            return data;
        }
        catch (error) {
            console.error(`we have an error while getting key and value ==> ${error}`);
            return Promise.reject(error);
        }
    }
    async decrementKeyInRedis(key) {
        try {
            let decrement = util_1.promisify(this.client.decr).bind(this.client);
            let value = await decrement(key);
            _services_1.logger(`keys value decremented ==> ${key}`);
            return value;
        }
        catch (error) {
            console.error(`we have an error while decrementing a key ==> ${error}`);
            return Promise.reject(error);
        }
    }
    async expireKey(key, expireTime) {
        try {
            let expire = util_1.promisify(this.client.expire).bind(this.client);
            let data = await expire(key, expireTime);
            _services_1.logger(data, "expiration status");
            return {};
        }
        catch (error) {
            console.error(`we have an error in expire key method ==> ${error}`);
            return Promise.reject(error);
        }
    }
    async getTTL(key) {
        try {
            let TTL = util_1.promisify(this.client.ttl).bind(this.client);
            console.log("key name", key);
            let ttl = await TTL(key);
            return ttl;
        }
        catch (error) {
            console.error(`we have an error while incrementing a key ==> ${error}`);
            return Promise.reject(error);
        }
    }
    async insertKeyInRedisHash(key, field, value) {
        try {
            let hmset = util_1.promisify(this.client.hmset).bind(this.client);
            await hmset(key, field, value);
            return {};
        }
        catch (error) {
            console.error(`we have an error while saving object in redis ==> ${error}`);
            return Promise.reject(error);
        }
    }
    async getKeyFromRedisHash(key, field) {
        try {
            let hget = util_1.promisify(this.client.hget).bind(this.client);
            return await hget(key, field);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async updateUserDataInRedis(userData) {
        try {
            let dataToSaveInRedis = {
                'userId': userData._id,
                'sessionId': userData.sessionId,
                'deviceId': userData.deviceDetails && userData.deviceDetails.deviceId ? userData.deviceDetails.deviceId : "",
                'fullName': userData.fullName,
                'fullPhoneNo': userData.phoneNo ? `${userData.countryCode}${userData.phoneNo}` : "",
                'phoneNo': userData.phoneNo ? userData.phoneNo : "",
                'email': userData.email ? userData.email : "",
                'profilePicture': userData.profilePicture ? userData.profilePicture : "",
                'deviceToken': userData.deviceDetails && userData.deviceDetails.deviceToken ? userData.deviceDetails.deviceToken : '0'
            };
            let hashBucket = _services_1.getBucket(userData._id.toString());
            _services_1.logger(`${hashBucket}, bucketData, ${_common_1.DATABASE.REDIS.KEY_NAMES.DEVICE_TOKEN_HASH}:${hashBucket}`);
            return await this.insertKeyInRedisHash(`${_common_1.DATABASE.REDIS.KEY_NAMES.DEVICE_TOKEN_HASH}:${hashBucket}`, userData.sessionId.toString(), JSON.stringify(dataToSaveInRedis));
        }
        catch (error) {
            console.error(`we have an error while updating user data in redis ==> ${error}`);
            return Promise.reject(error);
        }
    }
    async getFromKey(key) {
        return new Promise((res, rej) => {
            this.client.get(key, (err, reply) => {
                if (err)
                    rej(err);
                else
                    res(reply);
            });
        });
    }
    async deleteKey(key) {
        return new Promise((res, rej) => {
            this.client.del(key, (err, reply) => {
                if (err)
                    rej(err);
                else
                    res(reply);
            });
        });
    }
    async getIndentity(key) {
        try {
            let updatedIndentity = (parseInt(await this.getFromKey(key)) + 1).toString();
            this.setKey(key, updatedIndentity);
            return updatedIndentity;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async lPushInRedis(key, element, prefix) {
        try {
            this;
            let promise1 = util_1.promisify(this.client.lpush).bind(this.client);
            await promise1(key.toString() + prefix, element);
            return {};
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async deleteListInRedis(key) {
        try {
            let promise1 = util_1.promisify(this.client.del).bind(this.client);
            await promise1(key.toString());
            return {};
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async userSocketOp(op, userId, socketId) {
        switch (op) {
            case 'SET': {
                if (socketId)
                    this.setKey(`SOC_${userId}`, socketId);
                else
                    throw Error('REDIS_ERR: No socketId specified in userSocketId - set operation');
                break;
            }
            case 'GET': return this.getFromKey(`SOC_${userId}`);
            case 'DEL': return this.deleteKey(`SOC_${userId}`);
        }
    }
}
exports.redisDOA = new Redis();
//# sourceMappingURL=redis.database.js.map