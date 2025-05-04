import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { NewSupplierModalComponent } from './new-supplier-modal/new-supplier-modal.component';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, NewSupplierModalComponent,FormsModule],
  templateUrl: './suppliers.component.html',
})
export class SuppliersComponent implements OnInit {
  suppliers: User[] = [];
  filteredSuppliers: User[] = []; // Stores the filtered suppliers based on search
  
  isSupplierModalOpen = false;
  currentPage = 1;
  itemsPerPage = 6;
  selectedSupplier: User | null = null;
  searchQuery: string = ''; // Holds the search query for filtering

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  // Load suppliers from the backend
  loadSuppliers(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.suppliers = data;
        this.filteredSuppliers = data; // Initialize filteredSuppliers to all suppliers initially
      },
      error: (err) => {
        console.error('Error loading suppliers', err);
      }
    });
  }

  // Handle search input and filter suppliers
  onSearch(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredSuppliers = this.suppliers.filter(supplier =>
      supplier.username.toLowerCase().includes(query) ||
      supplier.email.toLowerCase().includes(query)
    );
    this.currentPage = 1; // Reset to the first page when searching
  }

  // Open modal
  openSupplierModal(): void {
    this.isSupplierModalOpen = true;
  }

  // Close modal
  closeSupplierModal(): void {
    this.isSupplierModalOpen = false;
    this.selectedSupplier = null;
  }

  addSupplier(newSupplier: User): void {
    this.userService.create(newSupplier).subscribe({
      next: () => {
        this.closeSupplierModal();
        this.loadSuppliers(); // Reload list from backend
      },
      error: (err) => {
        const errorMessage = err.error?.error || 'An unknown error occurred.';
        console.error('Error adding supplier:', errorMessage);
        alert(errorMessage); // or show it in a toast/snackbar/UI
      }
    });
  }

  // Delete supplier
  deleteSupplier(id: number): void {
    this.userService.delete(id).subscribe({
      next: () => {
        this.loadSuppliers(); // Reload list from backend
      },
      error: (err) => {
        console.error('Error deleting supplier', err);
      }
    });
  }

   // Example actions (implement later if needed)
   approveSupplier(id: number): void {
    console.log('Approved supplier with ID:', id);
  }


  toggleBlockStatus(supplier: User): void {
    const action = supplier.blocked ? 'unblock' : 'block';
    const confirmed = confirm(`Are you sure you want to ${action} "${supplier.username}"?`);
    if (!confirmed) return;
  
    const request = supplier.blocked
      ? this.userService.unblockUser(supplier.username)
      : this.userService.blockUser(supplier.username);
  
    request.subscribe({
      next: () => {
        supplier.blocked = !supplier.blocked;
        this.loadSuppliers();
      },
      error: (err) => {
        console.error(`Failed to ${action}:`, err);
        alert(`Failed to ${action} user.`);
      }
    });
  }
  
  

  
  
   
  // Pagination logic
  get paginatedSuppliers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredSuppliers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredSuppliers.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  copyToClipboard(value: string): void {
    navigator.clipboard.writeText(value).then(() => {
      alert('Password copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy!', err);
    });
  }
}
