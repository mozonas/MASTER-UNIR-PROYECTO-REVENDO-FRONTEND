import { StreamingResourceOptions } from "@angular/core";

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
  image: string | null;
  estado_reporte?: number | null;
  // AÑADIDO PARA COMPATIBILIDAD CON Article
  ubicacion: string;
}