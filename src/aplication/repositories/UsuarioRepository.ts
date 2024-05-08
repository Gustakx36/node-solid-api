import { Usuario } from '../../domain/entities/usuario.js';

export interface UsuarioRepository {
    usuarioExiste(): Promise<boolean>;
    acessarUsuario(): Promise<Usuario | null | false>;
    criarUsuario(): Promise<boolean>;
}