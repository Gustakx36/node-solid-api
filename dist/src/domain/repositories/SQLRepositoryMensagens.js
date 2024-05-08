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
exports.SQLRepositoryMensagens = void 0;
const mensagem_js_1 = require("../../domain/entities/mensagem.js");
const connection_js_1 = require("./connection/connection.js");
class SQLRepositoryMensagens {
    constructor(user, amigo) {
        this.connection = new connection_js_1.Connection();
        this.mensagensPerReq = 20;
        this.user = user;
        this.amigo = amigo;
    }
    conversaExiste() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield this.connection.executeGet('SELECT * FROM mensagens WHERE toFrom = ? OR toFrom = ?', [`${this.user}${this.amigo}`, `${this.amigo}${this.user}`]);
            return query ? query.toFrom : false;
        });
    }
    acessarConversa() {
        return __awaiter(this, void 0, void 0, function* () {
            const conversa = yield this.conversaExiste();
            if (!conversa)
                return [];
            const queryMsg = yield this.connection.executeAll('SELECT * FROM mensagens WHERE toFrom = ?', [conversa]);
            const Mensagens = queryMsg.map((item) => {
                return new mensagem_js_1.Conversa(item);
            });
            return Mensagens;
        });
    }
    enviarMensagem(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            var conversa = yield this.conversaExiste();
            let idCriacao;
            if (!conversa) {
                conversa = {};
                conversa = `${this.user}${this.amigo}`;
                idCriacao = 1;
            }
            else {
                const todosItens = yield this.acessarConversa();
                const ultimoId = todosItens[todosItens.length - 1].response.idCriacao;
                idCriacao = ultimoId + 1;
            }
            yield this.connection.executeRun(`
            INSERT INTO mensagens(idCriacao, msg, toFrom, 'to', 'from') VALUES(?, ?, ?, ?, ?)`, [idCriacao,
                msg,
                conversa,
                this.user,
                this.amigo]);
            return { status: true, from: this.user, msg: this.amigo };
        });
    }
    conversaEmPartes(nivel, amais) {
        return __awaiter(this, void 0, void 0, function* () {
            const incio = this.mensagensPerReq * nivel + amais;
            const conversa = yield this.conversaExiste();
            console.log([conversa,
                incio,
                this.mensagensPerReq]);
            if (!conversa)
                return [];
            const queryMsg = yield this.connection.executeAll('SELECT * FROM `mensagens` WHERE toFrom = ? AND idCriacao <= (SELECT count(*) FROM mensagens) - ? ORDER BY idCriacao DESC LIMIT ?', [conversa,
                incio,
                this.mensagensPerReq]);
            const Mensagens = queryMsg.map((item) => {
                return new mensagem_js_1.Conversa(item);
            }).slice(0).reverse();
            return {
                status: true,
                mensagens: Mensagens,
                statusFim: Mensagens.length == 0
            };
        });
    }
}
exports.SQLRepositoryMensagens = SQLRepositoryMensagens;
