import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-crear-valoracion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './valoraciones.html',
  styleUrls: ['./valoraciones.css']
})
export class ValoracionesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  valoracionForm: FormGroup = this.fb.group({
    puntuacion: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    comentario: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
  });
  idVendedor!: number;
  transaccionId!: number;
  articuloTitulo: string = '';

  ratingHover: number = 0;
  isSubmitting: boolean = false;
  errorMessage: string | null = null;
  yaValorada: boolean = false;

  ngOnInit(): void {
    // 1. Recuperamos todo de los queryParams
    this.idVendedor = Number(this.route.snapshot.queryParamMap.get('vendedorId'));
    this.transaccionId = Number(this.route.snapshot.queryParamMap.get('transaccionId'));
    this.articuloTitulo = this.route.snapshot.queryParamMap.get('titulo') || 'Producto';

    // 2. Obtenemos el ID del usuario logueado actualmente
    const currentUserId = Number(this.authService.getUserId());

    console.log('DEBUG REVENDO - ID Vendedor Destino:', this.idVendedor);
    console.log('DEBUG REVENDO - ID Mi Usuario Logueado:', currentUserId);

    // 3. Validación de seguridad estricta
    if (!this.idVendedor || this.idVendedor === currentUserId) {
      console.warn('⚠️ Acción inválida o intentando autoevaluarse.');
      this.router.navigate(['/home']);
      return;
    }

    this.initForm();
    this.comprobarTransaccionActiva(currentUserId);
  }

  private initForm(): void {
    this.valoracionForm = this.fb.group({
      puntuacion: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comentario: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  // Comprueba dinámicamente si esta transacción específica ya ha sido calificada en la BD
  private comprobarTransaccionActiva(compradorId: number): void {
    this.userService.getTransaccionPendiente(this.idVendedor, compradorId).subscribe({
      next: (transaccionPendiente) => {
        // Si no hay transacción pendiente, o la devuelta no coincide con la de la URL, significa que ya ha sido valorada
        if (!transaccionPendiente || transaccionPendiente.transaccion_id !== this.transaccionId) {
          this.yaValorada = true;
          this.errorMessage = 'Esta transacción ya ha sido calificada previamente. ¡Gracias por participar!';
          this.valoracionForm.disable();
        }
      },
      error: (err) => {
        console.error('Error al verificar estado de la valoración:', err);
      }
    });
  }

  setRating(rating: number): void {
    if (this.yaValorada) return;
    this.valoracionForm.patchValue({ puntuacion: rating });
  }

  setHover(rating: number): void {
    if (this.yaValorada) return;
    this.ratingHover = rating;
  }

  onSubmit(): void {
    if (this.valoracionForm.invalid || this.yaValorada) {
      this.valoracionForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const payload = {
      vendedor_id: this.idVendedor,
      puntuacion: this.valoracionForm.value.puntuacion,
      comentario: this.valoracionForm.value.comentario,
      transaccionId: this.transaccionId
    };

    this.userService.guardarValoracionUsuario(payload).subscribe({
      next: (res) => {
        console.log('✅ Valoración guardada con éxito', res);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('❌ Error al guardar la valoración', err);
        this.errorMessage = err.error?.message || 'Hubo un problema al procesar tu valoración. Inténtalo de nuevo.';
        this.isSubmitting = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/home']);
  }
}