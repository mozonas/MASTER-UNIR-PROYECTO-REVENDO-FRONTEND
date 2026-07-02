import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModerationService } from '../../../../services/moderation.service';
import { ChatService } from '../../../../services/chat.service';
import { ChatReport } from '../../../../interfaces/moderation.interface';
//mog 300626 importamos authservice parala lógica de navegación admin/moderator
import { AuthService } from '../../../../services/auth.service';
import {AdminUserService} from "../../../../services/admin/admin-user.service";
@Component({
  selector: 'app-chat-report-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-report-detail.component.html',
  styleUrl: './chat-report-detail.component.css'
})
export class ChatReportDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private moderationService = inject(ModerationService);
  private chatService = inject(ChatService);

  reporte: ChatReport | null = null;
  mensajesConversacion: any[] = [];
  cargandoMensajes: boolean = false;

  mensajeNotificacion: string = '';
  enviando: boolean = false;
  mensajeResultado: string = '';
  exito: boolean = false;

  resolviendo: boolean = false;
  //mog 300626 inyectamos
  private auth = inject(AuthService);
  private getBasePath(): string {
    return this.auth.getUserRole() === 'ADMIN'
      ? '/admin/moderacion'
      : '/moderation';
  }
  //mog 02072026
  isAdmin = this.auth.getUserRole() === 'ADMIN';
  private adminUserService= inject(AdminUserService);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/moderation/chat']);
      return;
    }
    this.cargarReporte(id);
  }

  cargarReporte(id: number) {
    this.moderationService.getPendingChats().subscribe({
      next: (chats) => {
        this.reporte = chats.find(c => c.id === id) || null;
        if (!this.reporte) {
          this.moderationService.getChatHistory().subscribe({
            next: (history) => {
              this.reporte = history.find(c => c.id === id) || null;
              this.cargarMensajesSiHayArticulo();
            }
          });
        } else {
          this.cargarMensajesSiHayArticulo();
        }
      },
      error: (err) => console.error(err)
    });
  }

  cargarMensajesSiHayArticulo() {
    if (!this.reporte?.articulos_id) return;

    this.cargandoMensajes = true;
    this.chatService.getMensajesPorArticulo(this.reporte.articulos_id).subscribe({
      next: (mensajes) => {
        this.mensajesConversacion = mensajes;
        this.cargandoMensajes = false;
      },
      error: () => {
        this.cargandoMensajes = false;
      }
    });
  }

  enviarNotificacion() {
    if (!this.mensajeNotificacion.trim() || !this.reporte) return;

    this.enviando = true;
    this.moderationService.enviarNotificacion(
      this.reporte.id,
      this.reporte.articulos_id || 0,
      this.mensajeNotificacion
    ).subscribe({
      next: () => {
        this.exito = true;
        this.mensajeResultado = 'Notificación enviada correctamente.';
        this.enviando = false;
        this.mensajeNotificacion = '';
      },
      error: () => {
        this.exito = false;
        this.mensajeResultado = 'Error al enviar la notificación.';
        this.enviando = false;
      }
    });
  }

/*   resolverIncidencia(accion: 'archivar' | 'bloquear') {
    if (!this.reporte) return;
    this.resolviendo = true;

    this.moderationService.resolveReportChat(this.reporte.id, accion).subscribe({
      next: () => {
        this.resolviendo = false;
        this.exito = true;
        this.mensajeResultado = accion === 'archivar'
          ? 'Incidencia archivada correctamente.'
          : 'Usuario bloqueado correctamente.';
        if (this.reporte) {
          this.reporte.estado = accion === 'archivar' ? 'activo' : 'retirado';
        }

      },
      error: () => {
        this.resolviendo = false;
        this.exito = false;
        this.mensajeResultado = 'Error al resolver la incidencia.';
      }
    });
  } */
 
    resolverIncidencia(accion: 'archivar' | 'bloquear') {
  if (!this.reporte) return;
  this.resolviendo = true;

  const finalizarResolucion = () => {
    this.resolviendo = false;
    this.exito = true;
    this.mensajeResultado = accion === 'archivar'
      ? 'Incidencia archivada correctamente.'
      : 'Usuario bloqueado correctamente.';

    if (this.reporte) {
      this.reporte.estado = accion === 'archivar' ? 'activo' : 'retirado';
    }
  };

  const manejarError = () => {
    this.resolviendo = false;
    this.exito = false;
    this.mensajeResultado = 'Error al resolver la incidencia.';
  };

  // ✔ Caso especial: bloquear → primero bloquear usuario, luego resolver reporte
  if (accion === 'bloquear') {
    this.adminUserService.blockUserFromReport(this.reporte.id).subscribe({
      next: () => {
        if (!this.reporte) return;
        this.moderationService.resolveReportChat(this.reporte!.id, accion).subscribe({
          next: finalizarResolucion,
          error: manejarError
        });
      },
      error: manejarError
    });
    return;
  }

  // ✔ Caso normal: archivar
  this.moderationService.resolveReportChat(this.reporte.id, accion).subscribe({
    next: finalizarResolucion,
    error: manejarError
  });
}


/*   volver() {
    this.router.navigate(['/moderation/chat']);
  } */

  volver(): void {
    const base = this.getBasePath();
    this.router.navigate([base + '/chat']);
  }

}