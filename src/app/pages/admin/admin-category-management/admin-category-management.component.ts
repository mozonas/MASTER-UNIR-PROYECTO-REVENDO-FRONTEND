import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AdminCategoryService } from '../../../services/admin/admin-category.service';
import { FormsModule } from '@angular/forms';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-admin-category-management',
  templateUrl: './admin-category-management.component.html',
  styleUrls: ['./admin-category-management.component.css'],
  imports: [FormsModule,DatePipe]
})
export class AdminCategoryManagementComponent implements OnInit {

  categories: any[] = [];
  page = 1;
  limit = 20;
  totalPages = 1;

  nombreCategoria: string = '';
  editMode = false;
  editId: number | null = null;

  constructor(
    private categoryService: AdminCategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories(this.page, this.limit).subscribe({
      next: (res) => {
        this.categories = res.categories;
        this.totalPages = res.totalPages;

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando categorías:', err)
    });
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadCategories();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadCategories();
    }
  }

  // CREAR
  createCategory() {
    if (!this.nombreCategoria.trim()) return;

    this.categoryService.createCategory(this.nombreCategoria).subscribe({
      next: () => {
        this.nombreCategoria = '';
        this.loadCategories();
      },
      error: (err) => console.error(err)
    });
  }

  // EDITAR
  startEdit(cat: any) {
    this.editMode = true;
    this.editId = cat.id;
    this.nombreCategoria = cat.nombre;
  }

  updateCategory() {
    if (!this.editId) return;

    this.categoryService.updateCategory(this.editId, this.nombreCategoria).subscribe({
      next: () => {
        this.editMode = false;
        this.editId = null;
        this.nombreCategoria = '';
        this.loadCategories();
      },
      error: (err) => console.error(err)
    });
  }

  // ELIMINAR
  deleteCategory(id: number) {
    if (!confirm('¿Seguro que quieres eliminar esta categoría?')) return;

    this.categoryService.deleteCategory(id).subscribe({
      next: () => this.loadCategories(),
      error: (err) => console.error(err)
    });
  }

  // CANCELAR
  cancelEdit() {
    this.editMode = false;
    this.editId = null;
    this.nombreCategoria = '';
  }

}
