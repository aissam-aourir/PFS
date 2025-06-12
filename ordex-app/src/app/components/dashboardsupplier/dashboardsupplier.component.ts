import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product';
import { Category } from '../../models/category';

@Component({
  selector: 'app-dashboardsupplier',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboardsupplier.component.html',
})
export class DashboardsupplierComponent implements OnInit, OnDestroy {
  username: string = '';
  email: string = '';
  phone: string | null = null; // Nouveau champ
  createdAt: Date = new Date();
  categoriesCount: number = 0;
  productsCount: number = 0;
  pendingProductsCount: number = 0;
  categoryProductsCount: number = 0; // Nouveau champ
  currentDate: Date = new Date();
  isLoading: boolean = false;
  private refreshInterval: any;
  supplierId!: string;
  category: Category | null = null; // Une seule catégorie avec @OneToOne

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.username = this.authService.username || 'Fournisseur';
    this.email = this.authService.email || 'fournisseur@example.com';
    this.createdAt = new Date(); // À ajuster avec une date réelle depuis le backend
    if (this.authService.userId) {
      this.supplierId = this.authService.userId;
      this.loadData();
      this.loadCategory();
    } else {
      console.error('Supplier ID is missing');
    }
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadData(): void {
    this.isLoading = true;
    this.productService.getProductsBySupplier(Number(this.supplierId)).subscribe((products: Product[]) => {
      this.productsCount = products.length;
      this.pendingProductsCount = products.filter(p => !p.isValidByAdmin).length;
      this.isLoading = false;
    });
  }

  loadCategory(): void {
    this.isLoading = true;
    this.categoryService.getCategoriesBySupplier(Number(this.supplierId)).subscribe(categories => {
      this.category = categories.length > 0 ? categories[0] : null; // Prend la première catégorie (limite @OneToOne)
      this.categoriesCount = categories.length;
      if (this.category) {
        this.loadCategoryProductsCount();
      }
      this.isLoading = false;
    });
  }

  loadCategoryProductsCount(): void {
    if (this.category) {
      this.productService.getProductsBySupplier(Number(this.supplierId)).subscribe((products: Product[]) => {
        this.categoryProductsCount = products.filter(p => p.category?.id === this.category?.id).length;
      });
    }
  }

  startAutoRefresh(): void {
    this.refreshInterval = setInterval(() => {
      this.loadData();
      this.loadCategory();
    }, 30000);
  }

  refreshData(): void {
    this.loadData();
    this.loadCategory();
  }

  openProfileModal(): void {
    // Implémenter une modal pour modifier le profil (à ajouter)
    console.log('Open profile modal');
  }

  openCategoryModal(): void {
    // Implémenter une modal pour créer/modifier la catégorie (à ajouter)
    console.log('Open category modal');
  }
}
