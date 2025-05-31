import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html'
})
export class MainComponent implements OnInit {
  selectedProduct: Product | null = null;
  products: Product[] = [];
  cart: Product[] = [];

  constructor(
    private productService: ProductService,
    public authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCartFromLocalStorage();
  }

  loadProducts(): void {
    this.productService.getValidProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data.slice(0, 10); // Already filtered from backend
      },
      error: (err) => {
        console.error('Error loading valid products', err);
      }
    });
  }

  getCartKey(): string {
    return `cart-${this.authService.username || 'guest'}`;
  }

  addToCart(product: Product): void {
    if (!this.authService.isUserAuthenticated()) {
      this.router.navigate(['/login']).catch(err => console.error('Navigation error:', err));
      return;
    }

    const existingProduct = this.cart.find(p => p.id === product.id);
    if (!existingProduct) {
      this.cart.push({ ...product, quantity: 1 });
      localStorage.setItem(this.getCartKey(), JSON.stringify(this.cart));
      this.cartService.setCartItems(this.cart);
    } else {
      alert('Ce produit est déjà dans votre panier !');
    }
  }

  loadCartFromLocalStorage(): void {
    if (this.authService.isUserAuthenticated()) {
      const key = this.getCartKey();
      const storedCart = localStorage.getItem(key);
      this.cart = storedCart ? JSON.parse(storedCart) : [];
      this.cartService.setCartItems(this.cart);
    } else {
      this.cart = []; // Pas de panier pour les utilisateurs non connectés
      this.cartService.setCartItems(this.cart);
    }
  }

  isInCart(productId: number): boolean {
    return this.cart.some(p => p.id === productId);
  }

  showProductDetails(product: Product): void {
    this.selectedProduct = { ...product };
  }

  closeProductDetails(): void {
    this.selectedProduct = null;
  }

  scrollToProducts(): void {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToAboutUs(): void {
    const aboutSection = document.getElementById('about-ordex');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
