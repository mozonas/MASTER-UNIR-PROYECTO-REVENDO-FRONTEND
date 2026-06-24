import { ChangeDetectionStrategy, Component, inject, OnInit, DestroyRef, signal, viewChildren, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArticleService } from '../../../services/article.service';

@Component({
        selector: 'app-article-form',
        imports: [CommonModule, ReactiveFormsModule],
        templateUrl: './article-form.component.html',
        styleUrls: ['./article-form.component.css'],
        changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleFormComponent implements OnInit {
        private fb = inject(FormBuilder);
        private articleService = inject(ArticleService);
        private route = inject(ActivatedRoute);
        private router = inject(Router);
        private destroyRef = inject(DestroyRef);

        articleForm!: FormGroup;
        isEditing = false;
        currentArticleId: string | null = null;
        submitted = false;
        activeErrorField: string | null = null;
        selectedImageFiles = signal<File[]>([]);
        existingImageUrls = signal<string[]>([]);
        private readonly maxImages = 5;

        tipoEntregaOptions = signal<string[]>([]);
        tipoPagoOptions = signal<string[]>([]);
        estadoProductoOptions = signal<string[]>([]);
        categoriasOptions = signal<Array<{ id: number; nombre: string }>>([]);
        private readonly formFields = viewChildren<ElementRef<HTMLElement>>('formField')

        private readonly fieldValidationOrder = [
                'titulo',
                'precio',
                'descripcion',
                'categorias_id',
                'tipoEntrega',
                'tipoPago',
                'estadoProducto',
                'imageFiles',
        ] as const;

        ngOnInit(): void {
                this.articleService.getArticleEnums()
                        .pipe(takeUntilDestroyed(this.destroyRef))
                        .subscribe({
                                next: (enums) => {
                                        if (enums.tipoEntrega) this.tipoEntregaOptions.set(enums.tipoEntrega);
                                        if (enums.tipoPago) this.tipoPagoOptions.set(enums.tipoPago);
                                        if (enums.estadoProducto) this.estadoProductoOptions.set(enums.estadoProducto);
                                        if (enums.categorias) this.categoriasOptions.set(enums.categorias);
                                },
                                error: (err) => console.error('Error al cargar ENUMs del artículo:', err)
                        });

                this.articleForm = this.fb.group({
                        titulo: ['', [Validators.required, Validators.maxLength(120)]],
                        descripcion: ['', [Validators.required, Validators.minLength(20)]],
                        precio: [0, [Validators.required, Validators.min(1)]],
                        estadoProducto: ['', Validators.required],
                        tipoEntrega: ['', Validators.required],
                        tipoPago: ['', Validators.required],
                        categorias_id: ['', [Validators.required]],
                        imageFiles: [null, [Validators.required]],
                });
                this.route.paramMap
                        .pipe(takeUntilDestroyed(this.destroyRef))
                        .subscribe((params) => {
                                const articleId = params.get('id');

                                this.submitted = false;
                                this.activeErrorField = null;
                                this.articleForm.reset({
                                        titulo: '',
                                        descripcion: '',
                                        precio: 0,
                                        estadoProducto: '',
                                        tipoEntrega: '',
                                        tipoPago: '',
                                        categorias_id: '',
                                        imageFiles: null,
                                });
                                this.selectedImageFiles.set([]);
                                this.existingImageUrls.set([]);

                                if (articleId) {
                                        this.isEditing = true;
                                        this.articleForm.get('imageFiles')?.clearValidators();
                                        this.articleForm.get('imageFiles')?.updateValueAndValidity({ emitEvent: false });
                                        this.currentArticleId = articleId;
                                        this.loadArticle(articleId);
                                        return;
                                }

                                this.isEditing = false;
                                this.articleForm.get('imageFiles')?.setValidators([Validators.required]);
                                this.articleForm.get('imageFiles')?.updateValueAndValidity({ emitEvent: false });
                                this.currentArticleId = null;
                        });
        }

        private loadArticle(articleId: string): void {
                this.articleService.getUserArticleForEdit(articleId).subscribe({
                        next: (article) => {
                                if (!article) {
                                        return;
                                }
                                const imageUrls = article.fotos?.map((foto) => foto.url).slice(0, 5) ?? [];
                                this.existingImageUrls.set(imageUrls.length ? imageUrls : (article.image ? [article.image] : []));
                                this.articleForm.patchValue({
                                        titulo: article.titulo,
                                        descripcion: article.descripcion,
                                        precio: article.precio,
                                        estadoProducto: article.estadoProducto ?? '',
                                        tipoEntrega: article.tipoEntrega,
                                        tipoPago: article.tipoPago,
                                        categorias_id: article.categorias_id ?? '',
                                        imageFiles: null,
                                });
                        },
                        error: (error) => {
                                console.error('Error al cargar artículo para editar:', error);
                        }
                });
        }

        onImagesSelected(event: Event): void {
                const input = event.target as HTMLInputElement;
                const files = Array.from(input.files ?? []);

                if (files.length === 0) {
                        this.selectedImageFiles.set([]);
                        this.articleForm.get('imageFiles')?.setValue(null);
                        return;
                }

                const validImageFiles = files.filter((file) => this.isAllowedImageFile(file));
                const invalidFiles = files.filter((file) => !this.isAllowedImageFile(file));

                if (invalidFiles.length > 0) {
                        alert('Solo se permiten archivos de imagen (jpg, jpeg, png, webp, gif, bmp, svg).');
                }

                const limitedFiles = validImageFiles.slice(0, this.maxImages);
                if (validImageFiles.length > this.maxImages) {
                        alert(`Solo se permiten ${this.maxImages} imágenes como máximo.`);
                }

                this.selectedImageFiles.set(limitedFiles);
                this.articleForm.get('imageFiles')?.setValue(limitedFiles.length ? limitedFiles : null);
        }

        clearSelectedImages(): void {
                this.selectedImageFiles.set([]);
                this.articleForm.get('imageFiles')?.setValue(null);
        }

        private isAllowedImageFile(file: File): boolean {
                if (file.type.startsWith('image/')) {
                        return true;
                }

                return /\.(jpg|jpeg|png|webp|gif|bmp|svg)$/i.test(file.name);
        }

        private buildFormData(): FormData {
                const formValue = this.articleForm.value;
                const formData = new FormData();

                formData.append('titulo', String(formValue.titulo ?? ''));
                formData.append('descripcion', String(formValue.descripcion ?? ''));
                formData.append('precio', String(formValue.precio ?? ''));
                formData.append('estadoProducto', String(formValue.estadoProducto ?? ''));
                formData.append('tipoEntrega', String(formValue.tipoEntrega ?? ''));
                formData.append('tipoPago', String(formValue.tipoPago ?? ''));
                formData.append('categorias_id', String(formValue.categorias_id ?? ''));

                for (const file of this.selectedImageFiles()) {
                        formData.append('images', file, file.name);
                }

                return formData;
        }

        onSubmit(): void {
                this.submitted = true;
                this.activeErrorField = this.getFirstInvalidField();

                if (this.articleForm.invalid || this.activeErrorField) {
                        
                        if(this.activeErrorField){
                                const targetField = this.formFields().find(field =>
                                        field.nativeElement.getAttribute('formControlName') === this.activeErrorField
                                );
                                if(targetField){
                                        const element = targetField.nativeElement;
                                        element.scrollIntoView({behavior:'smooth', block:'center'})
                                        element.focus();
                                }

                        }
                        return;
                }

                const articlePayload = this.buildFormData();
                if (this.isEditing && this.currentArticleId) {
                        this.articleService.updateArticle(this.currentArticleId, articlePayload).subscribe({
                                next: () => this.router.navigate(['/user-info']),
                                error: (error) => {
                                        console.error('Error al actualizar el artículo:', error);
                                        alert(error?.error?.message || 'No se pudo guardar el artículo. Intente de nuevo.');
                                }
                        });
                        return;
                }

                this.articleService.createArticle(articlePayload).subscribe({
                        next: () => this.router.navigate(['/user-info']),
                        error: (error) => {
                                console.error('Error al crear el artículo:', error);
                                alert(error?.error?.message || 'No se pudo crear el artículo. Intente de nuevo.');
                        }
                });
        }

        isControlInvalid(controlName: string): boolean {
                if (!this.submitted || this.activeErrorField !== controlName) {
                        return false;
                }

                const control = this.articleForm.get(controlName);
                return !!control && control.invalid;
        }

        private getFirstInvalidField(): string | null {
                for (const field of this.fieldValidationOrder) {
                        const control = this.articleForm.get(field);
                        if (control?.invalid) {
                                return field;
                        }
                }

                return null;
        }

        goBack(): void {
        window.history.back();
        }
}
