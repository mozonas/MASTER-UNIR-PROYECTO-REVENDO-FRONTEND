export interface iArticle {
  id: string;
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
  categoria_nombre?: string;
  image: string | null;
  estado_reporte?: number | null;
}