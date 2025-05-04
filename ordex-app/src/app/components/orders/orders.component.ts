import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order';
import { OrderService } from '../../services/order.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, ToastrModule],
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit {

  selectedOrder: Order | null = null;
  orders: Order[] = [];
  currentPage = 1;
  itemsPerPage = 8;


  constructor(private orderService: OrderService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.fetchOrders();
  }

  // Method to fetch orders
  fetchOrders(): void {
    this.orderService.getOrders().subscribe(
      (data: Order[]) => {
        this.orders = data;
      },
      (error) => {
        console.error('Error fetching orders', error);
      }
    );
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  viewProducts(order: Order): void {
    this.selectedOrder = order;
  }

  closeProductView(): void {
    this.selectedOrder = null;
  }

  completeOrder(order: any) {
    // Show a confirmation dialog before updating the order status
    const confirmed = window.confirm('Are you sure you want to complete this order?');

    if (confirmed) {
      // Make an API call to update the order status to 'Completed'
      order.status = 'Completed';
      this.updateOrderStatus(order, 'Completed');
    }
  }

  cancelOrder(order: any) {
    // Show a confirmation dialog before canceling the order
    const confirmed = window.confirm('Are you sure you want to cancel this order?');

    if (confirmed) {
      // Make an API call to update the order status to 'Canceled'
      order.status = 'Canceled';
      this.updateOrderStatus(order, 'Canceled');
    }
  }


  updateOrderStatus(order: any, status: string) {
    this.orderService.updateOrder(order).subscribe(
      response => {
        console.log('Order status updated:', response);
        this.fetchOrders();
        if (status === 'Completed') {
          this.toastr.success('Order completed successfully!', 'Order Completed', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            toastClass: 'ngx-toastr toast toast-success rounded shadow-sm w-72',
          });
        } else if (status === 'Canceled') {
          this.toastr.warning('Order was canceled.', 'Order Canceled', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            toastClass: 'ngx-toastr toast toast-warning rounded shadow-sm w-72',
          });
        }
      },
      error => {
        console.error('Error updating order status:', error);
      }
    );
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
