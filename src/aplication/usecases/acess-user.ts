import { SQLRepositoryUsuario } from "../../domain/repositories/SQLRepositoryUsuario.js";

export class AcessUser{
    constructor(
        private usuarioRepository: SQLRepositoryUsuario
    ) {}

    async execute(){
        return await this.usuarioRepository.acessarUsuario();
    }
}