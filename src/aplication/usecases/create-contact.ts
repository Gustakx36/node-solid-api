import { SQLRepositoryAmigos } from "../../domain/repositories/SQLRepositoryAmigos.js";

export class CreateContact{
    constructor(
        private amigoRepositorie: SQLRepositoryAmigos
    ) {}

    async execute(){
        return await this.amigoRepositorie.criarAmizade();
    }
}