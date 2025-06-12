import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Added for ngModel
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../models/category';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { NewProductModalComponent } from './new-product-modal/new-product-modal.component';
import { EditProductModalComponent } from './edit-product-modal/edit-product-modal.component';
import { CategoryModalComponent } from './category-modal/category-modal.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, NewProductModalComponent, EditProductModalComponent, CategoryModalComponent, ToastrModule],
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  products: Product[] = [];
  filteredProducts: Product[] = []; // Store filtered products
  categories: Category[] = [];
  currentPage = 1;
  itemsPerPage = 6;
  isModalOpen = false;
  isEditModalOpen = false;
  isCategoryModalOpen = false;
  productToEdit?: Product;
  supplierId!: string;

  // Filter properties
  searchQuery: string = '';
  selectedStatus: string = '';
  selectedCategory: string = '';
  minStock: number | null = null;

  ngOnInit(): void {
    if (this.authService.userId) {
      this.supplierId = this.authService.userId;
      this.loadProductsBySupplier(this.supplierId);
    } else {
      this.toastr.error("Supplier ID is missing", "Error");
    }
    this.loadCategories();
  }

  loadProductsBySupplier(supplierId: string): void {
    const supplierIdNum = Number(supplierId);
    this.productService.getProductsBySupplier(supplierIdNum).subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data; // Initialize filteredProducts
        this.applyFilters(); // Apply any default filters (optional)
      },
      error: (err) => {
        this.toastr.error("No products found", "Warning", {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true,
          toastClass: 'ngx-toastr toast toast-warning rounded shadow-sm w-72',
        });
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error loading categories', err);
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1; // Reset to first page on filter change
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = this.searchQuery
        ? product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;

      const matchesStatus = this.selectedStatus
        ? product.isValidByAdmin.toString() === this.selectedStatus
        : true;

      const matchesCategory = this.selectedCategory
        ? product.category.id.toString() === this.selectedCategory
        : true;

      const matchesStock = this.minStock !== null
        ? product.stock >= this.minStock
        : true;

      return matchesSearch && matchesStatus && matchesCategory && matchesStock;
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openEditModal(product: Product) {
    this.productToEdit = product;
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  openCategoryModal() {
    this.isCategoryModalOpen = true;
  }

  closeCategoryModal() {
    this.isCategoryModalOpen = false;
  }

  addProduct(product: Product): void {
    this.productService.create(product).subscribe({
      next: (newProduct) => {
        this.toastr.success("New Product has been sent to the Admin to validate", "Request sent", {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true,
          toastClass: 'ngx-toastr toast toast-success rounded shadow-sm w-72',
        });
        this.loadProductsBySupplier(this.supplierId);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error creating product', err);
        this.toastr.error(err, "Error", {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true,
          toastClass: 'ngx-toastr toast toast-danger rounded shadow-sm w-72',
        });
      }
    });
  }

  deleteProduct(id?: number): void {
    if (!id) {
      alert('Product ID is missing');
      return;
    }

    const confirmDelete = confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) {
      return;
    }

    this.productService.delete(id).subscribe({
      next: () => {
        this.loadProductsBySupplier(this.supplierId);
        console.log('Product deleted');
      },
      error: (err) => {
        console.error('Error deleting product', err);
      }
    });
  }

  updateProduct(product: Product): void {
    this.productService.update(product.id!, product).subscribe({
      next: (updated) => {
        console.log('Product Updated:', updated);
        this.loadProductsBySupplier(this.supplierId);
        this.closeEditModal();
      },
      error: (err) => {
        console.error('Error updating product', err);
      }
    });
  }

  // Dans products.component.ts, modifier uniquement la méthode addCategory
  addCategory({ name, supplierId }: { name: string, supplierId: string }): void {
    const newCategory: Partial<Category> = { name };
    this.categoryService.createWithSupplier(newCategory, supplierId).subscribe({
      next: () => {
        this.toastr.success("Catégorie ajoutée avec succès", "Succès");
        this.loadCategories();
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de la catégorie', err);
        this.toastr.error("Erreur lors de l'ajout de la catégorie", "Erreur");
      }
    });
  }

  deleteCategory(id: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this category?');
    if (!confirmDelete) return;

    this.categoryService.delete(id).subscribe({
      next: () => {
        console.log('Category deleted successfully.');
        this.loadCategories();
      },
      error: (err) => {
        if (err.status === 400 || err.status === 409) {
          alert('❗ An unexpected error occurred while deleting the category.');
        } else {
          alert('❗ Cannot delete this category because it has associated products. Please delete the products first.');
        }
        console.error('Error deleting category', err);
      }
    });
  }

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
