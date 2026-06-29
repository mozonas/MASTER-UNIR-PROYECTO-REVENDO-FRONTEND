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

  // valoracionForm!: FormGroup;
  valoracionForm: FormGroup = this.fb.group({
    puntuacion: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    comentario: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
  });
  idVendedor!: number;
  transaccionId!: number; // Cambiado para mapear directamente con la clave foránea de la BD
  articuloTitulo: string = '';

  ratingHover: number = 0;
  isSubmitting: boolean = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    // 1. Recuperamos TODO de forma segura de los queryParams
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
  }

  private initForm(): void {
    this.valoracionForm = this.fb.group({
      puntuacion: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comentario: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  setRating(rating: number): void {
    this.valoracionForm.patchValue({ puntuacion: rating });
  }

  setHover(rating: number): void {
    this.ratingHover = rating;
  }

  onSubmit(): void {
    if (this.valoracionForm.invalid) {
      this.valoracionForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    // Ajustamos las claves exactamente a lo que destructura tu controlador 'createValoracion'
    const payload = {
      vendedor_id: this.idVendedor, // Usado por el servicio Angular para armar la URL del endpoint
      puntuacion: this.valoracionForm.value.puntuacion,
      comentario: this.valoracionForm.value.comentario,
      transaccionId: this.transaccionId // Clave requerida por el backend e insertada en la tabla
    };

    this.userService.guardarValoracionUsuario(payload).subscribe({
      next: (res) => {
        console.log('✅ Valoración guardada con éxito', res);
        // Redirige de vuelta al perfil de información del vendedor
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