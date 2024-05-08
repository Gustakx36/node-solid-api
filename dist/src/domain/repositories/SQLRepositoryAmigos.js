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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLRepositoryAmigos = void 0;
const connection_js_1 = require("./connection/connection.js");
class SQLRepositoryAmigos {
    constructor(user, amigo) {
        this.connection = new connection_js_1.Connection();
        this.user = user;
        this.amigo = amigo;
    }
    amizadeExiste() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield this.connection.executeGet('SELECT * FROM amigos WHERE idUser = (SELECT id FROM users WHERE nome = ?)', [this.user]);
            return query ? true : false;
        });
    }
    acessarAmigos() {
        return __awaiter(this, void 0, void 0, function* () {
            const queryUserAmigos = yield this.connection.executeAll('SELECT * FROM amigos WHERE idUser = (SELECT id FROM users WHERE nome = ?)', [this.user]);
            const amigos = queryUserAmigos.map((item) => {
                return item.nome;
            });
            return amigos;
        });
    }
    criarAmizade() {
        return __awaiter(this, void 0, void 0, function* () {
            const usuariosExiste = yield this.connection.executeAll('SELECT * FROM users WHERE nome IN (?, ?)', [this.amigo, this.user]);
            if (!(usuariosExiste.length == 2) || (yield this.amizadeExiste()))
                return { status: false, msg: 'Usuário não existe' };
            yield this.connection.executeRun('INSERT INTO amigos (nome, idUser) VALUES(?, (SELECT id FROM users WHERE nome = ?)), (?, (SELECT id FROM users WHERE nome = ?))', [this.amigo, this.user, this.user, this.amigo]);
            return { status: true, msg: 'Usuário adicionado a lista de amigos' };
        });
    }
}
exports.SQLRepositoryAmigos = SQLRepositoryAmigos;
