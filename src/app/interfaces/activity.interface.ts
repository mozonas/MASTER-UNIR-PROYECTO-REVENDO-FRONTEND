export interface Activity {
  type: 'usuario' | 'articulo' | 'venta' | 'reporte';
  description: string;
  user: string;
  date: string;
}