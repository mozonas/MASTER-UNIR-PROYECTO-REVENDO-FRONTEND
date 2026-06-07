export interface iArticle {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  image?: string;
  estadoVenta: 'DISPONIBLE' | 'VENDIDO' | 'RESERVADO';
  tipoEntrega: 'Envío' | 'En mano';
  tipoPago: 'Efectivo' | 'Tarjeta' | 'Bizum';
  created_at: Date;
  usuarios_id: string;
  categorias_id: string;
}
