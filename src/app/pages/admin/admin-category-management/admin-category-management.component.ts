import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AdminCategoryService } from '../../../services/admin/admin-category.service';
import { FormsModule } from '@angular/forms';
import {DatePipe} from '@angular/common';
import Swal from 'sweetalert2';

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

    // Scroll al input
    setTimeout(() => {
    const el = document.getElementById('categoria-input');
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 0);
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
  
  Swal.fire({
    title: '¿Seguro que quieres eliminar esta categoría?',
    text: 'Esta acción no se puede deshacer y podría afectar a los productos asociados.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545', 
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  }).then((result) => {
    
    //Si el usuario confirma la eliminación:
    if (result.isConfirmed) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          // 3. Alerta de éxito cuando el backend responda
          Swal.fire({
            title: '¡Eliminada!',
            text: 'La categoría ha sido eliminada correctamente.',
            icon: 'success',
            confirmButtonColor: '#8cd86a'
          });
          
          // Recargamos la lista de categorías
          this.loadCategories();
        },
        error: (err) => {
          console.error(err);
          
        }
      });
    }
  });
}

  // CANCELAR
  cancelEdit() {
    this.editMode = false;
    this.editId = null;
    this.nombreCategoria = '';
  }

}
