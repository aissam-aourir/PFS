import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../models/order';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-orders.component.html'
})
export class UserOrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  statusFilter: string = 'all'; // ici on va faire filtrage
  dateSort: string = 'desc';    // ici on va faire tri par date
  totalSort: string = 'none';   // ici on va faire tri par montant total

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const clientId = this.authService.getUserId();
    console.log('Client ID:', clientId);
    if (clientId) {
      this.orderService.getOrdersByUserId(clientId).subscribe({
        next: (data: any[]) => {
          console.log('Commandes reçues:', data);
          this.orders = data.map(item => ({
            id: item.id,
            total: item.total,
            status: item.status.toUpperCase(), // Normalisation des statuts en majuscules
            phone: item.phone,
            createdAt: item.createdAt,
            paymentMethod: item.paymentMethod,
            client: {
              username: item.client?.username || 'Inconnu'
            },
            orderProducts: item.orderProducts?.map((op: any) => ({
              id: op.id || 0,
              quantity: op.quantity,
              priceAtPurchases: op.priceAtPurchases,
              order: null,
              product: {
                id: op.product?.id,
                name: op.product?.name,
                description: '',
                price: 0,
                stock: 0,
                imageURL: op.product?.imageURL || '',
                createdAt: '',
                category: { id: 0, name: '' },
                isValidByAdmin: false,
                supplier: null
              }
            })) || []
          }));
          console.log('Orders assignées:', this.orders);
          this.applyFilters();
        },
        error: (err) => console.error('Erreur de récupération des commandes', err)
      });
    } else {
      console.error('Client ID non défini');
    }
  }

  applyFilters(): void {
    let tempOrders = [...this.orders];

    // Filtre par statut
    if (this.statusFilter !== 'all') {
      tempOrders = tempOrders.filter(order => order.status === this.statusFilter);
    }

    // Tri par date
    if (this.dateSort !== 'none') {
      tempOrders.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return this.dateSort === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }

    // Tri par montant total
    if (this.totalSort !== 'none') {
      tempOrders.sort((a, b) => {
        return this.totalSort === 'asc' ? a.total - b.total : b.total - a.total;
      });
    }

    this.filteredOrders = tempOrders;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  handleImageError(event: Event, productName: string) {
    console.error(`Erreur de chargement de l'image pour le produit ${productName}:`, (event.target as HTMLImageElement).src);
  }
}
