import express, {Express, request, Response} from 'express';
import bp from 'body-parser';
import { AcessUser } from './src/aplication/usecases/acess-user.js';
import { CreateContact } from './src/aplication/usecases/create-contact.js';
import { ConversaEmPartes } from './src/aplication/usecases/conversa-em-partes.js';
import { EnviarMensagem } from './src/aplication/usecases/enviar-mensagem.js';
import { SQLRepositoryUsuario } from './src/domain/repositories/SQLRepositoryUsuario.js';
import { SQLRepositoryAmigos } from './src/domain/repositories/SQLRepositoryAmigos.js';
import { SQLRepositoryMensagens } from './src/domain/repositories/SQLRepositoryMensagens.js';

const port = 8000;

const app = express();

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
<p>Logar Usuario        - /logarUser/usuario/sessionId</p>
<p>Criar Amizade        - /criarAmizade/usuario/amigo</p>
<p>Conversa em Partes   - /conversaEmPartes/usuario/amigo/page/mensagensAmais</p>
<p>Enviar Mensagem      - /enviarMensagem/usuario/amigo/msg</p>
    `)
});

app.get(/\/logarUser\/([a-zA-Z0-9., ]+)(\/([a-zA-Z0-9., ]+)|)/, async (req, res) => {
    const nome: string = req.params[0];
    const id: string = req.params[2];
    const logarUser = new AcessUser(new SQLRepositoryUsuario(nome, id));
    const logar = await logarUser.execute();
    res.send(logar);
});

app.get(/\/criarAmizade\/([a-zA-Z0-9., ]+)\/([a-zA-Z0-9., ]+)/, async (req, res) => {
    const nome: string = req.params[0];
    const amigo: string = req.params[1];
    const criarContacto = new CreateContact(new SQLRepositoryAmigos(nome, amigo));
    const constacto = await criarContacto.execute();
    res.send(constacto);
});

app.get(/\/conversaEmPartes\/([a-zA-Z0-9., ]+)\/([a-zA-Z0-9., ]+)\/([0-9]+)\/([0-9]+)/, async (req, res) => {
    const nome: string = req.params[0];
    const amigo: string = req.params[1];
    const nivel: number = parseInt(req.params[2]);
    const amais: number = parseInt(req.params[3]);
    const acessarConversa = new ConversaEmPartes(new SQLRepositoryMensagens(nome, amigo), nivel, amais);
    const conversa = await acessarConversa.execute();
    res.send(conversa);
});

app.get(/\/enviarMensagem\/([a-zA-Z0-9., ]+)\/([a-zA-Z0-9., ]+)\/([a-zA-Z0-9., ]+)/, async (req, res) => {
    const nome: string = req.params[0];
    const amigo: string = req.params[1];
    const msg: string = req.params[2];
    const acessarConversa = new EnviarMensagem(new SQLRepositoryMensagens(nome, amigo), msg);
    const conversa = await acessarConversa.execute();
    res.send(conversa);
});

app.listen(port, () => {
    console.log(`Server inicializado na porta ${port}!`);
})