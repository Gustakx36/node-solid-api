import { AmigoRepository } from "../../aplication/repositories/AmigoRepository.js";
import { Connection } from "./connection/connection.js";

export class SQLRepositoryAmigos implements AmigoRepository{
    private connection = new Connection();
    private user : string;
    private amigo: string | undefined;

    constructor(user: string, amigo?: string){
        this.user = user;
        this.amigo = amigo;
    }

    async amizadeExiste() {
        const query = await this.connection.executeGet('SELECT * FROM amigos WHERE idUser = (SELECT id FROM users WHERE nome = ?)', [this.user]);
        return query ? true : false;
    }
    async acessarAmigos() {
        const queryUserAmigos = await this.connection.executeAll('SELECT * FROM amigos WHERE idUser = (SELECT id FROM users WHERE nome = ?)', [this.user]);
        const amigos = queryUserAmigos.map((item) => {
            return item.nome;
        });
        return amigos;
    }
    async criarAmizade() {
        const usuariosExiste = await this.connection.executeAll('SELECT * FROM users WHERE nome IN (?, ?)', [this.amigo, this.user]);
        if(!(usuariosExiste.length == 2) || await this.amizadeExiste())return {status: false, msg : 'Usuário não existe'};
        await this.connection.executeRun('INSERT INTO amigos (nome, idUser) VALUES(?, (SELECT id FROM users WHERE nome = ?)), (?, (SELECT id FROM users WHERE nome = ?))', [this.amigo, this.user, this.user, this.amigo]);
        return {status: true, msg : 'Usuário adicionado a lista de amigos'};
    }
}