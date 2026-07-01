import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { ModerationService } from '../../services/moderation.service';
import { AuthService } from '../../services/auth.service';
import { ReportType } from '../../interfaces/report-type.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-type',
  imports: [FormsModule],
  templateUrl: './report-type.component.html',
  styleUrl: './report-type.component.css',
})
export class ReportTypeComponent implements OnInit {
  
  private moderationService = inject(ModerationService);
  private authService = inject(AuthService);
  

  targetType = input.required<'ARTICULO' | 'USUARIO'>();
  targetId = input.required<number>(); 
  targetTitle = input<string>('');    

 
  closeModal = output<void>();
  onReportSuccess = output<void>();

  
  listReportTypes = signal<ReportType[]>([]);
  selectedTypeReport = signal<number>(0);
  motivoReporte = signal('');
  enviandoReporte = signal(false);
  mensajeReporte = signal('');

  ngOnInit(): void {
    
    this.moderationService.getReportTypes(this.targetType()).subscribe({
      next: (data: any) => this.listReportTypes.set(data),
      error: () => this.mensajeReporte.set('Error al cargar el tipo de reporte.')
    });
  }

  cerrarModalReporte(): void {
    this.closeModal.emit();
  }

  onSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const idSeleccionada = Number(selectElement.value);
    const tipusTrobat = this.listReportTypes().find(t => t.id === idSeleccionada);
    
    if (tipusTrobat) {
      this.selectedTypeReport.set(tipusTrobat.id);
    }
  }

  enviarReporte(): void {
    if (this.selectedTypeReport() === 0) {
      this.mensajeReporte.set('Por favor, selecciona un motivo.');
      return;
    }

    const usuarioId = this.authService.getUserId();
    if (!usuarioId) {
      this.mensajeReporte.set('Error: Iniciar sesión para reportar.');
      return;
    }
    this.enviandoReporte.set(true);

    if (this.targetType() === 'USUARIO') {
      this.moderationService.reportarUsuarioChat(
        this.motivoReporte().trim(),
        usuarioId,
        this.targetId()
      ).subscribe({
        next: () => {
          this.mensajeReporte.set('Reporte enviado con éxito. Quedará en revisión.');
          this.enviandoReporte.set(false);
          this.onReportSuccess.emit();
          setTimeout(() => this.closeModal.emit(), 2000);
        },
        error: () => {
          this.mensajeReporte.set('Error al enviar el reporte. Inténtalo de nuevo.');
          this.enviandoReporte.set(false);
        }
      });
    } else {
      this.moderationService.reportArticle(
        this.targetId(),
        this.motivoReporte().trim(),
        this.selectedTypeReport(),
        usuarioId
      ).subscribe({
        next: () => {
          this.mensajeReporte.set('Reporte enviado con éxito. Quedará en revisión.');
          this.enviandoReporte.set(false);
          this.onReportSuccess.emit();
          setTimeout(() => this.closeModal.emit(), 1000);
        },
        error: () => {
          this.mensajeReporte.set('Error al enviar el reporte. Inténtalo de nuevo.');
          this.enviandoReporte.set(false);
        }
      });
    }
  }
}
