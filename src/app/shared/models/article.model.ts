export interface Article {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  ubicacion: string;
  categorias_id: number;
  categoria_nombre?: string;
  usuarios_id: number;
  imagen?: string;
}
