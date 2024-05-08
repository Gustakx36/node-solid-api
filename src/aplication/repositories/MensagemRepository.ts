import { Conversa } from '../../domain/entities/mensagem.js';

type ResponseEnviarMensagem = {
    status : boolean
    from : string;
    msg : string;
}

type ResponseConversaEmPartes = {
    status : boolean;
    mensagens: Conversa[];  
    statusFim: boolean;
}

export interface MensagemRepository {
    conversaExiste(): Promise<boolean>;
    acessarConversa(): Promise<Conversa[]>;
    enviarMensagem(msg : string): Promise<ResponseEnviarMensagem>;
    conversaEmPartes(nivel: number, amais :number): Promise<ResponseConversaEmPartes | never[]>;
}