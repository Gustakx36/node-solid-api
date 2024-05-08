import { MensagemRepository } from "../../aplication/repositories/MensagemRepository.js";
import { Conversa } from '../../domain/entities/mensagem.js';
import { Connection } from "./connection/connection.js";

export class SQLRepositoryMensagens implements MensagemRepository{
    private connection = new Connection();
    private user : string;
    private amigo: string;
    private mensagensPerReq = 20;

    constructor(user: string, amigo: string){
        this.user = user;
        this.amigo = amigo;
    }

    async conversaExiste() {
        const query = await this.connection.executeGet('SELECT * FROM mensagens WHERE toFrom = ? OR toFrom = ?', [`${this.user}${this.amigo}`, `${this.amigo}${this.user}`]);
        return query ? query.toFrom : false;
    }
    async acessarConversa() {
        const conversa = await this.conversaExiste();
        if(!conversa) return [];
        const queryMsg = await this.connection.executeAll('SELECT * FROM mensagens WHERE toFrom = ?', [conversa]);
        const Mensagens = queryMsg.map((item) => {
            return new Conversa(item);
        });
        return Mensagens;
    }
    async enviarMensagem(msg : string) {
        var conversa = await this.conversaExiste();
        let idCriacao;
        if(!conversa) {
            conversa = {};
            conversa = `${this.user}${this.amigo}`;
            idCriacao = 1;
        }else{
            const todosItens = await this.acessarConversa();
            const ultimoId = todosItens[todosItens.length - 1].response.idCriacao;
            idCriacao = ultimoId + 1;
        }
        await this.connection.executeRun(`
            INSERT INTO mensagens(idCriacao, msg, toFrom, 'to', 'from') VALUES(?, ?, ?, ?, ?)`, 
            [idCriacao, 
            msg, 
            conversa, 
            this.user, 
            this.amigo]);
        return {status : true, from: this.user,  msg: this.amigo};
    }
    async conversaEmPartes(nivel: number, amais :number) {
        const incio = this.mensagensPerReq * nivel + amais;
        const conversa = await this.conversaExiste();
        console.log([conversa, 
            incio, 
            this.mensagensPerReq])
        if(!conversa) return [];
        const queryMsg = await this.connection.executeAll(
            'SELECT * FROM `mensagens` WHERE toFrom = ? AND idCriacao <= (SELECT count(*) FROM mensagens) - ? ORDER BY idCriacao DESC LIMIT ?', 
            [conversa, 
            incio, 
            this.mensagensPerReq]
        );
        const Mensagens = queryMsg.map((item) => {
            return new Conversa(item);
        }).slice(0).reverse();
        return {
            status : true,
            mensagens: Mensagens,
            statusFim: Mensagens.length == 0
        };
    }
}