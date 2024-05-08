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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const acess_user_js_1 = require("./src/aplication/usecases/acess-user.js");
const create_contact_js_1 = require("./src/aplication/usecases/create-contact.js");
const conversa_em_partes_js_1 = require("./src/aplication/usecases/conversa-em-partes.js");
const enviar_mensagem_js_1 = require("./src/aplication/usecases/enviar-mensagem.js");
const SQLRepositoryUsuario_js_1 = require("./src/domain/repositories/SQLRepositoryUsuario.js");
const SQLRepositoryAmigos_js_1 = require("./src/domain/repositories/SQLRepositoryAmigos.js");
const SQLRepositoryMensagens_js_1 = require("./src/domain/repositories/SQLRepositoryMensagens.js");
const port = 8000;
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('Teste');
});
app.get(/\/logarUser\/([a-zA-Z0-9., ]+)(\/([a-zA-Z0-9., ]+)|)/, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const nome = req.params[0];
    const id = req.params[2];
    const logarUser = new acess_user_js_1.AcessUser(new SQLRepositoryUsuario_js_1.SQLRepositoryUsuario(nome, id));
    const logar = yield logarUser.execute();
    res.send(logar);
}));
app.get(/\/criarAmizade\/([a-zA-Z0-9., ]+)\/([a-zA-Z0-9., ]+)/, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const nome = req.params[0];
    const amigo = req.params[1];
    const criarContacto = new create_contact_js_1.CreateContact(new SQLRepositoryAmigos_js_1.SQLRepositoryAmigos(nome, amigo));
    const constacto = yield criarContacto.execute();
    res.send(constacto);
}));
app.get(/\/conversaEmPartes\/([a-zA-Z0-9., ]+)\/([a-zA-Z0-9., ]+)\/([0-9]+)\/([0-9]+)/, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const nome = req.params[0];
    const amigo = req.params[1];
    const nivel = parseInt(req.params[2]);
    const amais = parseInt(req.params[3]);
    const acessarConversa = new conversa_em_partes_js_1.ConversaEmPartes(new SQLRepositoryMensagens_js_1.SQLRepositoryMensagens(nome, amigo), nivel, amais);
    const conversa = yield acessarConversa.execute();
    res.send(conversa);
}));
app.get(/\/enviarMensagem\/([a-zA-Z0-9., ]+)\/([a-zA-Z0-9., ]+)\/([a-zA-Z0-9., ]+)/, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const nome = req.params[0];
    const amigo = req.params[1];
    const msg = req.params[2];
    const acessarConversa = new enviar_mensagem_js_1.EnviarMensagem(new SQLRepositoryMensagens_js_1.SQLRepositoryMensagens(nome, amigo), msg);
    const conversa = yield acessarConversa.execute();
    res.send(conversa);
}));
app.listen(port, () => {
    console.log(`Server inicializado na porta ${port}!`);
});
