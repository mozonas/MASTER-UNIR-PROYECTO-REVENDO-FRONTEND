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
  estadoVenta?: 'DISPONIBLE' | 'VENDIDO' | 'EN_REVISION' | 'RETIRADO';
  estado_reporte?: number | null;
  foto?: string;    // lo que devuelve el backend
}
