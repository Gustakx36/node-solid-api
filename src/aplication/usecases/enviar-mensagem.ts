import { SQLRepositoryMensagens } from "../../domain/repositories/SQLRepositoryMensagens.js";

export class EnviarMensagem{
    private msg: string;

    constructor(
        private mensagemRepository: SQLRepositoryMensagens,
        msg: string
    ) {
        this.msg = msg;
    }

    async execute(){
        return await this.mensagemRepository.enviarMensagem(this.msg);
    }
}