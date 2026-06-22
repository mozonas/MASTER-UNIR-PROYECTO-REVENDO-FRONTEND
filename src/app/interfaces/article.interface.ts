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
  fotos?: Array<{ url: string; nombreAlt: string }>;
  estado_reporte?: number | null;
  seller?: {
    nombre?: string;
    apellidos?: string;
  };
  // AÑADIDO PARA COMPATIBILIDAD CON Article
  ubicacion: string;
  foto?: string;

}