import { UsuarioRepository } from "../../aplication/repositories/UsuarioRepository.js";
import { Usuario } from "../entities/usuario.js";
import { SQLRepositoryAmigos } from "./SQLRepositoryAmigos.js";
import { Connection } from "./connection/connection.js";

export class SQLRepositoryUsuario implements UsuarioRepository{
    private connection = new Connection();
    private nome: string;
    private amigos: SQLRepositoryAmigos;
    private sessionID?: string | undefined;

    constructor(nome: string, sessionID?: string){
        this.nome = nome.toLowerCase();
        this.sessionID = sessionID;
        this.amigos = new SQLRepositoryAmigos(this.nome);
    }

    async usuarioExiste() {
        const query = await this.connection.executeGet('SELECT * FROM users WHERE nome = ?', [this.nome]);
        return query ? true : false;
    }
    async acessarUsuario() {
        const usuarioExiste = await this.usuarioExiste();
        if(!usuarioExiste){
            if(!await this.criarUsuario())return false;
        }
        if(this.sessionID){
            await this.connection.executeRun('UPDATE users SET sessionId = ? WHERE nome = ?', [this.sessionID, this.nome]);
        }
        
        const query = new Usuario(await this.connection.executeGet('SELECT * FROM users WHERE nome = ?', [this.nome]));
        const amigosUser = await this.amigos.acessarAmigos();
        query.response.amigos = amigosUser;
        return query;
    }
    async criarUsuario() {
        if(!this.sessionID){
            return false;
        }
        await this.connection.executeRun('INSERT INTO users (nome, sessionId) VALUES(?, ?)', [this.nome, this.sessionID]);
        return true;
    }
}