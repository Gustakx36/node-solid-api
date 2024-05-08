import { SQLRepositoryMensagens } from "../../domain/repositories/SQLRepositoryMensagens.js";

export class ConversaEmPartes{
    private nivel: number;
    private amais: number;

    constructor(
        private mensagemRepository: SQLRepositoryMensagens,
        nivel: number, amais: number
    ) {
        this.nivel = nivel;
        this.amais = amais;
    }

    async execute(){
        return await this.mensagemRepository.conversaEmPartes(this.nivel, this.amais);
    }
}