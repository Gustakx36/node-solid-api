import { Entity } from "../../../core/domain/Entity.js";

type UsuarioProps = {
    id: number;
    nome: string;
    sessionID: string;
    amigos: string[];
}

export class Usuario extends Entity<UsuarioProps> {
    constructor(response: UsuarioProps){
        super(response);
    }
}