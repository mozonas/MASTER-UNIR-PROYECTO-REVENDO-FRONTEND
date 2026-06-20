export interface iArticle {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  estadoVenta: string;
  estadoProducto?: string;
  tipoEntrega: string;
  tipoPago: string;
  created_at: Date;
  usuarios_id: number;
  categorias_id: number;
  image: string | null;
  imagen?: string;               // ← AÑADIR ESTO
  estado_reporte?: number | null;

  estado?: string;
  localizacion?: string;
  ubicacion?: string;
  categoria_nombre?: string;
}
