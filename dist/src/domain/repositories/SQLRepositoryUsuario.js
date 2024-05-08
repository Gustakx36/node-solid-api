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
exports.SQLRepositoryUsuario = void 0;
const usuario_js_1 = require("../entities/usuario.js");
const SQLRepositoryAmigos_js_1 = require("./SQLRepositoryAmigos.js");
const connection_js_1 = require("./connection/connection.js");
class SQLRepositoryUsuario {
    constructor(nome, sessionID) {
        this.connection = new connection_js_1.Connection();
        this.nome = nome.toLowerCase();
        this.sessionID = sessionID;
        this.amigos = new SQLRepositoryAmigos_js_1.SQLRepositoryAmigos(this.nome);
    }
    usuarioExiste() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield this.connection.executeGet('SELECT * FROM users WHERE nome = ?', [this.nome]);
            return query ? true : false;
        });
    }
    acessarUsuario() {
        return __awaiter(this, void 0, void 0, function* () {
            const usuarioExiste = yield this.usuarioExiste();
            if (!usuarioExiste) {
                if (!(yield this.criarUsuario()))
                    return false;
            }
            if (this.sessionID) {
                yield this.connection.executeRun('UPDATE users SET sessionId = ? WHERE nome = ?', [this.sessionID, this.nome]);
            }
            const query = new usuario_js_1.Usuario(yield this.connection.executeGet('SELECT * FROM users WHERE nome = ?', [this.nome]));
            const amigosUser = yield this.amigos.acessarAmigos();
            query.response.amigos = amigosUser;
            return query;
        });
    }
    criarUsuario() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sessionID) {
                return false;
            }
            yield this.connection.executeRun('INSERT INTO users (nome, sessionId) VALUES(?, ?)', [this.nome, this.sessionID]);
            return true;
        });
    }
}
exports.SQLRepositoryUsuario = SQLRepositoryUsuario;
