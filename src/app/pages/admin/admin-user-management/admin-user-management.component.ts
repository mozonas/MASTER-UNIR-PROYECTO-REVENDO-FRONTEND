import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AdminUserService } from '../../../services/admin/admin-user.service';

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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminUserService.getUsers(this.page, this.limit).subscribe({
      next: (res) => {
        this.users = res.users;
        this.totalPages = res.totalPages;

        // 🔥 Esto es lo que hace que Angular ACTUALICE la vista
        this.cdr.detectChanges();
        console.log('RES COMPLETO:', res);
        console.log('USERS:', res.users);
        console.log('ES ARRAY?', Array.isArray(res.users));
        console.log('LENGTH:', res.users?.length);

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
}
