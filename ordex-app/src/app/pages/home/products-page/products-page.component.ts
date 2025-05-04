import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-page.component.html'
})
export class ProductsPageComponent implements OnInit {
  products: Product[] = [];
  cart: Product[] = [];
  


  constructor(private productService: ProductService,private authService:AuthService,  private cartService: CartService) {}



  ngOnInit(): void {
    this.loadProducts();
    this.loadCartFromLocalStorage();
  }

  loadProducts(): void {
    this.productService.getValidProducts().subscribe({
      next: (data: Product[]) => {
        // ✅ If authenticated, show all products
        this.products = this.authService.isUserAuthenticated() ? data : data.slice(0, 10);
      },
      error: (err) => {
        console.error('Error loading products', err);
      }
    });
  }
  getCartKey(): string {
    return `cart-${this.authService.username || 'guest'}`;
  }
  
  loadCartFromLocalStorage(): void {
    const key = this.getCartKey();
    const storedCart = localStorage.getItem(key);
    const cart = storedCart ? JSON.parse(storedCart) : [];
    this.cart = cart;
    this.cartService.setCartItems(this.cart);
  }
  
  addToCart(product: Product): void {
    const existingProduct = this.cart.find(p => p.id === product.id);
  
    if (!existingProduct) {
      this.cart.push({ ...product, quantity: 1 });
      localStorage.setItem(this.getCartKey(), JSON.stringify(this.cart));
      this.cartService.setCartItems(this.cart); // 🔁 notify listeners
    } else {
      alert("This product is already in your cart!");
    }
  }
  


  isInCart(productId: number): boolean {
    return this.cart.some(p => p.id === productId);
  }
  
}
