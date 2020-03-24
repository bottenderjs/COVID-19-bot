"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const isSameHour_1 = __importDefault(require("date-fns/isSameHour"));
let cached = {
    data: undefined,
    date: undefined,
};
function query({ country, date }) {
    return __awaiter(this, void 0, void 0, function* () {
        const now = new Date();
        if (!cached.data || !cached.date || !isSameHour_1.default(cached.date, now)) {
            const response = yield node_fetch_1.default('https://pomber.github.io/covid19/timeseries.json');
            const data = yield response.json();
            cached = {
                data,
                date: now,
            };
        }
        if (!cached.data)
            return;
        const foundRecord = cached.data[country]
            .reduce((acc, curr) => {
            if (acc.length === 0)
                return [Object.assign(Object.assign({}, curr), { added: 0 })];
            const prev = acc[acc.length - 1];
            return [...acc, Object.assign(Object.assign({}, curr), { added: curr.confirmed - prev.confirmed })];
        }, [])
            .find((record) => record.date === date);
        if (!foundRecord)
            return;
        return Object.assign(Object.assign({}, foundRecord), { active: foundRecord.confirmed - foundRecord.recovered - foundRecord.deaths });
    });
}
exports.default = query;
