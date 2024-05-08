import { Entity } from "../../../core/domain/Entity.js";

type ConversaProps = {
    id: number;
    toFrom: string;
    to: string;
    from: string;
    msg: string;
    idCriacao: string;
}

export class Conversa extends Entity<ConversaProps> {
    constructor(response: ConversaProps){
        super(response);
    }
}