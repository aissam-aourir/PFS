import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../models/order';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CommonModule, ToastrModule],
  templateUrl: './user-orders.component.html'
})
export class UserOrdersComponent implements OnInit {
  selectedOrder: Order | null = null;
  orders: Order[] = [];
  currentPage = 1;
  itemsPerPage = 8;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchUserOrders();
  }

  fetchUserOrders(): void {
    const username = this.authService.username;
    if (username) {
      this.orderService.getOrdersByUser(username).subscribe(
        (data: Order[]) => {
          // Normaliser les statuts pour uniformité
          this.orders = data.map(order => ({
            ...order,
            status: order.status.replace(/cancelled/i, 'Annulé')
          }));
          console.log('Commandes utilisateur :', this.orders);
        },
        (error) => {
          console.error('Erreur lors de la récupération des commandes utilisateur', error);
          this.toastr.error('Échec du chargement des commandes.', 'Erreur', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true
          });
        }
      );
    }
  }

  getStatusClass(status: string): string {
    switch (status.trim().toLowerCase()) {
      case 'en attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'complété':
        return 'bg-green-100 text-green-800';
      case 'annulé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  viewProducts(order: Order): void {
    this.selectedOrder = order;
  }

  get paginatedOrders(): Order[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.orders.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.orders.length / this.itemsPerPage);
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
