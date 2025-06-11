import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryDetails } from '../../models/categoryDetails';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit {
  categories: CategoryDetails[] = [];
  filteredCategories: CategoryDetails[] = [];
  paginatedCategories: CategoryDetails[] = [];
  newCategoryName = '';
  isLoading = false;

  // Filtres
  filterName: string = '';
  filterFournisseur: string = '';
  filterMinProducts: number | null = null;
  filterMaxProducts: number | null = null;
  sortBy: keyof CategoryDetails = 'name'; // Fixed: Removed '' from type
  sortOrder: 'asc' | 'desc' = 'asc';

  // Pagination
  currentPage = 1;
  pageSize = 8; // Aligné avec ClientsComponent et SuppliersComponent
  totalPages = 0;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.categoryService.getCategoryDetails().subscribe({
      next: (data) => {
        this.categories = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        alert('Erreur lors du chargement des catégories.');
      }
    });
  }

  addCategory() {
    if (!this.newCategoryName.trim()) {
      alert('Le nom de la catégorie ne peut pas être vide.');
      return;
    }

    const newCat = { name: this.newCategoryName };
    this.categoryService.create(newCat).subscribe({
      next: () => {
        this.newCategoryName = '';
        this.loadCategories();
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de la catégorie:', err);
        alert('Échec de l\'ajout de la catégorie.');
      }
    });
  }

  deleteCategory(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
      this.categoryService.delete(id).subscribe({
        next: () => this.loadCategories(),
        error: (err) => {
          console.error('Erreur lors de la suppression de la catégorie:', err);
          alert('Échec de la suppression de la catégorie.');
        }
      });
    }
  }

  applyFilters() {
    let result = [...this.categories];

    // Filtre par nom
    if (this.filterName.trim()) {
      result = result.filter(category =>
        category.name.toLowerCase().includes(this.filterName.toLowerCase())
      );
    }

    // Filtre par fournisseur
    if (this.filterFournisseur.trim()) {
      result = result.filter(category =>
        category.fournisseurName.toLowerCase().includes(this.filterFournisseur.toLowerCase())
      );
    }

    // Filtre par nombre de produits
    if (this.filterMinProducts !== null) {
      result = result.filter(category => category.productCount >= this.filterMinProducts!);
    }
    if (this.filterMaxProducts !== null) {
      result = result.filter(category => category.productCount <= this.filterMaxProducts!);
    }

    // Appliquer le tri
    result.sort((a, b) => {
      const aValue = a[this.sortBy];
      const bValue = b[this.sortBy];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return this.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    this.filteredCategories = result;
    this.totalPages = Math.ceil(this.filteredCategories.length / this.pageSize);
    this.currentPage = 1;
    this.paginateCategories();
  }

  resetFilters() {
    this.filterName = '';
    this.filterFournisseur = '';
    this.filterMinProducts = null;
    this.filterMaxProducts = null;
    this.sortBy = 'name';
    this.sortOrder = 'asc';
    this.applyFilters();
  }

  paginateCategories() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedCategories = this.filteredCategories.slice(start, end);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateCategories();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateCategories();
    }
  }
}




// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { CategoryDetails } from '../../models/categoryDetails';
// import { CategoryService } from '../../services/category.service';
//
// @Component({
//   selector: 'app-categories',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './categories.component.html'
// })
// export class CategoriesComponent implements OnInit {
//   categories: CategoryDetails[] = [];
//   newCategoryName = '';
//   isLoading = false;
//
//   sortColumn: keyof CategoryDetails | '' = '';
//   sortDirection: 'asc' | 'desc' = 'asc';
//
//   constructor(private categoryService: CategoryService) {}
//
//   ngOnInit(): void {
//     this.loadCategories();
//   }
//
//   loadCategories() {
//     this.isLoading = true;
//     this.categoryService.getCategoryDetails().subscribe({
//       next: (data) => {
//         this.categories = data;
//         this.isLoading = false;
//         this.sortColumn = '';
//       },
//       error: () => {
//         this.isLoading = false;
//       }
//     });
//   }
//
//   addCategory() {
//     if (!this.newCategoryName.trim()) return;
//
//     const newCat = { name: this.newCategoryName };
//     this.categoryService.create(newCat).subscribe({
//       next: () => {
//         this.newCategoryName = '';
//         this.loadCategories();
//       }
//     });
//   }
//
//   deleteCategory(id: number) {
//     if (confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
//       this.categoryService.delete(id).subscribe(() => this.loadCategories());
//     }
//   }
//
//   sortBy(column: keyof CategoryDetails) {
//     if (this.sortColumn === column) {
//       this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
//     } else {
//       this.sortColumn = column;
//       this.sortDirection = 'asc';
//     }
//
//     this.categories.sort((a, b) => {
//       const aValue = a[column];
//       const bValue = b[column];
//
//       if (typeof aValue === 'string' && typeof bValue === 'string') {
//         return this.sortDirection === 'asc'
//           ? aValue.localeCompare(bValue)
//           : bValue.localeCompare(aValue);
//       }
//
//       if (typeof aValue === 'number' && typeof bValue === 'number') {
//         return this.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
//       }
//
//       return 0;
//     });
//   }
// }
