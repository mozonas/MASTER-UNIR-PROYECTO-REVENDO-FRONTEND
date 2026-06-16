export interface BadgesResponse {
    pendingArticlesCount: number;
    pendingChatsCount: number;
}

export interface ArticleInReview {
    id: number;
    titulo: string;
    descripcion: string;
    precio: number;
    estadoVenta: string;
    usuarios_id: number;
    reporte_id: number;
    motivo: string;
    reporte_estado: string;
    fecha_reporte: string;
    foto?: string;
}
