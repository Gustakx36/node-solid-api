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
exports.Connection = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
class Connection {
    constructor() {
    }
    static connection() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, sqlite_1.open)({
                filename: './database.db',
                driver: sqlite3_1.default.cached.Database
            });
            return db;
        });
    }
    executeGet(sql, bind) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield Connection.connection();
            const query = yield db.get(sql, bind);
            return query;
        });
    }
    executeRun(sql, bind) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield Connection.connection();
            const query = yield db.run(sql, bind);
            return query;
        });
    }
    executeAll(sql, bind) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield Connection.connection();
            const query = yield db.all(sql, bind);
            return query;
        });
    }
}
exports.Connection = Connection;
