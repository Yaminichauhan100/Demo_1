"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatesV1 = void 0;
const base_entity_1 = __importDefault(require("../base.entity"));
const states_model_1 = __importDefault(require("@models/states.model"));
const mongoose_1 = require("mongoose");
class StatesEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async fetchStateNameByStateId(payload) {
        try {
            return await this.findOne({ id: payload.stateId }, { name: 1 });
        }
        catch (error) {
        }
    }
    async fetchUniqueStates(stateIds, payload) {
        try {
            let countryArray = [];
            stateIds.forEach((element) => {
                countryArray.push(mongoose_1.Types.ObjectId(element));
            });
            const pipeline = [
                {
                    $match: {
                        _id: { $in: stateIds },
                        country_id: payload.countryId
                    }
                }
            ];
            return await this.basicAggregate(pipeline);
        }
        catch (error) {
            console.error(`we have an error in fetchUniqueStates ==> ${error}`);
        }
    }
}
exports.StatesV1 = new StatesEntity(states_model_1.default);
//# sourceMappingURL=states.v1.entity.js.map