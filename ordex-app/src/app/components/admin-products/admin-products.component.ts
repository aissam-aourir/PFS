import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service'; // Import ProductService
import { ToastrService } from 'ngx-toastr'; // Import ToastrService
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-products',
  standalone:true,
  imports:[CommonModule,FormsModule],
  templateUrl: './admin-products.component.html',
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  currentPage = 1;
  itemsPerPage = 6;
  searchQuery = ''; // Add searchQuery variable

  constructor(
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error loading products', err);
      }
    });
  }

  // Implement search logic
  searchProducts(): void {
    this.currentPage = 1; // Reset to the first page when searching
  }

  get paginatedProducts(): Product[] {
    // Filter the products based on the search query
    const filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) // Case-insensitive search by product name
    );

    // Paginate the filtered products
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    const filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) // Case-insensitive search
    );
    return Math.ceil(filteredProducts.length / this.itemsPerPage);
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

  validateProduct(product: Product): void {
    if (!product.id) return;

    const confirmValidation = window.confirm('Are you sure you want to validate this product?');

    if (confirmValidation) {
      const updatedProduct = { ...product, isValidByAdmin: true };

      this.productService.update(product.id, updatedProduct).subscribe({
        next: () => {
          this.toastr.success("Product is valid now", "Product validated", {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            toastClass: 'ngx-toastr toast toast-success rounded shadow-sm w-72',
          });
          this.loadProducts();
        },
        error: (err) => {
          this.toastr.error("Validation failed", "Error", {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            toastClass: 'ngx-toastr toast toast-danger rounded shadow-sm w-72',
          });
        }
      });
    } else {
      console.log('Product validation canceled by the user');
    }
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
        this.loadProducts();
      },
      error: (err) => {
        console.error('Error deleting product', err);
      }
    });
  }
}
