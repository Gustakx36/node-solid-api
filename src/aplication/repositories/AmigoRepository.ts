type ResponseCriarAmizade = {
    status : boolean;
    msg : string;
}

export interface AmigoRepository {
    amizadeExiste(): Promise<boolean>;
    acessarAmigos(): Promise<string[]>;
    criarAmizade(): Promise<ResponseCriarAmizade>;
}