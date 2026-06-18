export interface ModerationModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  routePath: string;
  badgeCount: () => number;
}

export interface BadgesResponse {
    pendingArticlesCount: number;
    pendingChatsCount: number;
}

export interface ArticleReport {
    id: number;
    fecha: string | null;
    motivo: string;
    estado: 'pendiente' | 'activo' | 'retirado';
    created_at: string;
    titulo: string;
}

export interface ChatReport {
    id: number;
    fecha: string | null;
    motivo: string;
    estado: 'pendiente' | 'activo' | 'retirado';
    created_at: string;
    usuario: string;
}