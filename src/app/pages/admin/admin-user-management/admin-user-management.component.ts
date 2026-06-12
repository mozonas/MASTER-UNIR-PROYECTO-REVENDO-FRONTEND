import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AdminUserService } from '../../../services/admin/admin-user.service';
import { UserPageEditComponent } from '../../user/user-page-edit/user-page-edit';

@Component({
  selector: 'app-admin-user-management',
  templateUrl: './admin-user-management.component.html',
  styleUrls: ['./admin-user-management.component.css'],
})
export class AdminUserManagementComponent implements OnInit {

  users: any[] = [];
  page = 1;
  limit = 20;
  totalPages = 1;

  constructor(
    private adminUserService: AdminUserService,
    private cdr: ChangeDetectorRef,
    private router: Router   // ← AÑADIDO
  ) {}

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

  onEdit(id: number) {
    this.router.navigate(['/admin/users/editar', id]);
  }


  onDelete(id: number) {
    if (!confirm('¿Seguro que quieres eliminar este usuario?')) return;

    this.adminUserService.deleteUser(id).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => console.error(err)
    });
  }

  onToggleBlock(user: any) {
    const newState = user.isBlocked ? 0 : 1;

    this.adminUserService.toggleBlockUser(user.id, newState).subscribe({
      next: () => {
        user.isBlocked = newState; // actualizar en la tabla sin recargar
      },
      error: (err) => console.error(err)
    });
  }


}
