import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { OrderService } from '../../services/order.service';
import { CategoryService } from '../../services/category.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { Order } from '../../models/order';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  user: User | null = null;
  clientsCount: number = 0;
  ordersCount: number = 0;
  categoriesCount: number = 0;
  suppliersCount: number = 0;
  currentDate: Date = new Date('2025-05-30T18:43:00+01:00');
  isLoading: boolean = false;
  private refreshInterval: any;

  constructor(
    private clientService: ClientService,
    private orderService: OrderService,
    private categoryService: CategoryService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadData();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadUserProfile(): void {
    this.user = {
      username: this.authService.username || 'Admin',
      email: this.authService.email || 'admin@example.com',
      password: '',
      createdAt: new Date('2025-01-15'),
    };
  }

  loadData(): void {
    this.isLoading = true;

    this.clientService.getAll().subscribe(clients => {
      this.clientsCount = clients.length;
      this.isLoading = false;
    });

    this.orderService.getAll().subscribe(orders => {
      this.ordersCount = orders.length;
      this.isLoading = false;
    });

    this.categoryService.getAll().subscribe(categories => {
      this.categoriesCount = categories.length;
      this.isLoading = false;
    });

    this.userService.getAll().subscribe(suppliers => {
      this.suppliersCount = suppliers.length;
      this.isLoading = false;
    });
  }

  startAutoRefresh(): void {
    this.refreshInterval = setInterval(() => {
      this.loadData();
    }, 30000);
  }
}
