import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AdminUserService } from '../../../services/admin/admin-user.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-user-management',
  templateUrl: './admin-user-management.component.html',
  styleUrls: ['./admin-user-management.component.css'],
  imports: [FormsModule]
})
export class AdminUserManagementComponent implements OnInit {

  users: any[] = [];
  page = 1;
  limit = 20;
  totalPages = 1;
  searchId: string = '';
  searchUsername: string = '';
  searchEmail: string = '';

  constructor(
    private adminUserService: AdminUserService,
    private cdr: ChangeDetectorRef,
    private router: Router   // ← AÑADIDO
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminUserService.getUsers(this.page, this.limit).subscribe({
      next: (res) => {
        this.users = res.users;
        this.totalPages = res.totalPages;

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando usuarios:', err)
    });
  }

  // -------------------------
  // ACCIONES DE LOS ICONOS
  // -------------------------

  // Nuevo método para redirigir a la información del usuario
  onViewInfo(id: number) {
    this.router.navigate(['/admin/users/info', id]);
  }

  onEdit(id: number) {
    this.router.navigate(['/admin/users/editar', id]);
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadUsers();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadUsers();
    }
  }

  trackByUserId(index: number, user: any): number {
    return user.id;
  }

  // -------------------------
  // ACCIONES DE LOS ICONOS
  // -------------------------

  //**CGM-290626-implementación modal */
  onDelete(id: number) {
    Swal.fire({
    title: '¿Seguro que quieres eliminar este usuario?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#8cd86a'
    }).then((result) => {
    if (result.isConfirmed) {
      this.adminUserService.deleteUser(id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => {console.error(err);
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar al usuario.',
            icon: 'error'
          });
        }
      });
    }
    });
  }

  onToggleBlock(user: any) {
    const newState = user.isBlocked ? 0 : 1;

    this.adminUserService.toggleBlockUser(user.id, newState).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => console.error(err)
    });
  }

  //filtros
  // =========================
  //   BUSCAR POR ID (único)
  // =========================
  searchById() {
    if (!this.searchId.trim()) {
      this.loadUsers();   // si está vacío → carga todo
      return;
    }
    // limpiar otros filtros
    this.searchUsername = '';
    this.searchEmail = '';

    this.adminUserService.searchById(this.searchId).subscribe({
      next: (res) => {
        // el backend devuelve un único usuario
        this.users = res.user ? [res.user] : [];
      },
      error: (err) => console.error(err)
    });
  }


  // =============================
  //   BUSCAR POR USERNAME (único)
  // =============================
  searchByUsername() {
    if (!this.searchUsername.trim()) {
      this.loadUsers();
      return;
    }
    // limpiar otros filtros
    this.searchId = '';
    this.searchEmail = '';

    this.adminUserService.searchByUsername(this.searchUsername).subscribe({
      next: (res) => {
        this.users = res.user ? [res.user] : [];
      },
      error: (err) => console.error(err)
    });
  }


  // =========================
  //   BUSCAR POR EMAIL (único)
  // =========================
  searchByEmail() {
    if (!this.searchEmail.trim()) {
      this.loadUsers();
      return;
    }
    // limpiar otros filtros
    this.searchId = '';
    this.searchUsername = '';

    this.adminUserService.searchByEmail(this.searchEmail).subscribe({
      next: (res) => {
        this.users = res.user ? [res.user] : [];
      },
      error: (err) => console.error(err)
    });
  }




}
