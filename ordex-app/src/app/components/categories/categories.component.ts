import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryDetails } from '../../models/categoryDetails';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {
  categories: CategoryDetails[] = [];
  newCategoryName = '';
  isLoading = false;

  sortColumn: keyof CategoryDetails | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.categoryService.getCategoryDetails().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
        this.sortColumn = '';
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  addCategory() {
    if (!this.newCategoryName.trim()) return;

    const newCat = { name: this.newCategoryName };
    this.categoryService.create(newCat).subscribe({
      next: () => {
        this.newCategoryName = '';
        this.loadCategories();
      }
    });
  }

  deleteCategory(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
      this.categoryService.delete(id).subscribe(() => this.loadCategories());
    }
  }

  sortBy(column: keyof CategoryDetails) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.categories.sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return this.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }
}
