export interface Usuario {
    id: number;
    nombre: string;
    apellidos: string;
    email: string;
    usuario: string;
    foto: string | null;
    perfil: 'USUARIO' | 'MODERADOR' | 'ADMIN';
    fecha_nacimiento: string | null;
    created_at: string;
    direccion: string;
    descripcion: string;
}