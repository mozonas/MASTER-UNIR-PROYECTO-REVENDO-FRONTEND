import { ChangeDetectionStrategy, Component, inject, OnInit, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArticleService } from '../../../services/article.service';
import { AuthService } from '../../../services/auth.service';

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
        private authService = inject(AuthService);
        private route = inject(ActivatedRoute);
        private router = inject(Router);
        private destroyRef = inject(DestroyRef);

        articleForm!: FormGroup;
        isEditing = false;
        currentArticleId: string | null = null;
        userId: number | null = null;
        submitted = false;
        activeErrorField: string | null = null;

        tipoEntregaOptions = signal<string[]>([]);
        tipoPagoOptions = signal<string[]>([]);
        estadoProductoOptions = signal<string[]>([]);

        private readonly fieldValidationOrder = [
                'titulo',
                'precio',
                'descripcion',
                'categorias_id',
                'tipoEntrega',
                'tipoPago',
        ] as const;

        ngOnInit(): void {
                this.articleService.getArticleEnums()
                        .pipe(takeUntilDestroyed(this.destroyRef))
                        .subscribe({
                                next: (enums) => {
                                        if (enums.tipoEntrega) this.tipoEntregaOptions.set(enums.tipoEntrega);
                                        if (enums.tipoPago) this.tipoPagoOptions.set(enums.tipoPago);
                                        if (enums.estadoProducto) this.estadoProductoOptions.set(enums.estadoProducto);
                                },
                                error: (err) => console.error('Error al cargar ENUMs del artículo:', err)
                        });

                this.articleForm = this.fb.group({
                        titulo: ['', [Validators.required, Validators.maxLength(120)]],
                        descripcion: ['', [Validators.required, Validators.minLength(20)]],
                        precio: [0, [Validators.required, Validators.min(1)]],
                        estadoProducto: [''],
                        tipoEntrega: ['', Validators.required],
                        tipoPago: ['', Validators.required],
                        categorias_id: ['', [Validators.required, Validators.maxLength(50)]],
                        image: [''],
                        usuarios_id: [null],
                });

                this.route.queryParamMap
                        .pipe(takeUntilDestroyed(this.destroyRef))
                        .subscribe((queryParams) => {
                                this.userId = Number(queryParams.get('userId')) || this.authService.getUserId();
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
                                        image: '',
                                        usuarios_id: null,
                                });

                                if (articleId) {
                                        this.isEditing = true;
                                        this.currentArticleId = articleId;
                                        this.loadArticle(articleId);
                                        return;
                                }

                                this.isEditing = false;
                                this.currentArticleId = null;
                        });
        }

        private loadArticle(articleId: string): void {
                this.articleService.getUserArticleForEdit(articleId).subscribe({
                        next: (article) => {
                                if (!article) {
                                        return;
                                }
                                this.articleForm.patchValue({
                                        titulo: article.titulo,
                                        descripcion: article.descripcion,
                                        precio: article.precio,
                                        estadoProducto: article.estadoProducto ?? '',
                                        tipoEntrega: article.tipoEntrega,
                                        tipoPago: article.tipoPago,
                                        categorias_id: article.categorias_id ?? '',
                                        image: article.image ?? '',
                                        usuarios_id: article.usuarios_id ?? null,
                                });
                        },
                        error: (error) => {
                                console.error('Error al cargar artículo para editar:', error);
                        }
                });
        }

        onSubmit(): void {
                if (!this.userId) {
                        alert('No se pudo identificar al usuario para guardar el artículo.');
                        return;
                }

                this.submitted = true;
                this.activeErrorField = this.getFirstInvalidField();

                if (this.articleForm.invalid || this.activeErrorField) {
                        return;
                }

                const formValue = this.articleForm.value;
                const articlePayload = {
                        titulo: formValue.titulo,
                        descripcion: formValue.descripcion,
                        precio: formValue.precio,
                        estadoProducto: formValue.estadoProducto,
                        tipoEntrega: formValue.tipoEntrega,
                        tipoPago: formValue.tipoPago,
                        categorias_id: formValue.categorias_id,
                };
                if (this.isEditing && this.currentArticleId) {
                        this.articleService.updateArticle(this.currentArticleId, articlePayload).subscribe({
                                next: () => this.router.navigate(['/user-sell', this.userId!]),
                                error: (error) => {
                                        console.error('Error al actualizar el artículo:', error);
                                        alert(error?.error?.message || 'No se pudo guardar el artículo. Intente de nuevo.');
                                }
                        });
                        return;
                }

                this.articleService.createArticle(articlePayload, this.userId).subscribe({
                        next: () => this.router.navigate(['/user-sell', this.userId!]),
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

        cancel(): void {
                if (this.userId) {
                        this.router.navigate(['/user-sell', this.userId]);
                } else {
                        this.router.navigate(['/home']);
                }
        }
}
