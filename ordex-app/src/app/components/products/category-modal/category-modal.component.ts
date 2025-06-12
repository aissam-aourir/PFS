import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-modal.component.html'
})
export class CategoryModalComponent {
  @Input() isOpen: boolean = false;
  @Input() categories: Category[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() categoryDeleted = new EventEmitter<number>();
  @Output() addCategory = new EventEmitter<{ name: string, supplierId: string }>(); // Modifié pour inclure supplierId

  categoryForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private authService: AuthService // Injecter AuthService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      const supplierId = this.authService.getUserId(); // Récupérer l'ID de l'utilisateur
      if (supplierId) {
        this.addCategory.emit({
          name: this.categoryForm.value.name,
          supplierId: supplierId
        });
        this.categoryForm.reset();
      } else {
        this.errorMessage = 'Erreur : utilisateur non connecté.';
      }
    }
  }

  closeModal() {
    this.close.emit();
  }
}
