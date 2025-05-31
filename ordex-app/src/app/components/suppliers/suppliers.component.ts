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
  imports: [CommonModule, NewSupplierModalComponent, FormsModule],
  templateUrl: './suppliers.component.html',
})
export class SuppliersComponent implements OnInit {
  suppliers: User[] = [];
  filteredSuppliers: User[] = [];
  isSupplierModalOpen = false;
  currentPage = 1;
  itemsPerPage = 6;
  selectedSupplier: User | null = null;

  // Filtres
  filterUsername: string = '';
  filterEmail: string = '';
  filterStartDate: string = '';
  filterEndDate: string = '';
  filterBlocked: string = 'all'; // 'all', 'blocked', 'unblocked'
  sortBy: string = 'username'; // 'username', 'createdAt'
  sortOrder: string = 'asc'; // 'asc', 'desc'

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  // Charger les fournisseurs depuis le backend
  loadSuppliers(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.suppliers = data;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des fournisseurs', err);
      }
    });
  }

  // Appliquer les filtres et le tri
  applyFilters(): void {
    let result = [...this.suppliers];

    // Filtre par username
    if (this.filterUsername.trim()) {
      result = result.filter(supplier =>
        supplier.username.toLowerCase().includes(this.filterUsername.toLowerCase())
      );
    }

    // Filtre par email
    if (this.filterEmail.trim()) {
      result = result.filter(supplier =>
        supplier.email.toLowerCase().includes(this.filterEmail.toLowerCase())
      );
    }

    // Filtre par plage de dates
    if (this.filterStartDate) {
      const startDate = new Date(this.filterStartDate);
      result = result.filter(supplier =>
        supplier.createdAt && new Date(supplier.createdAt) >= startDate
      );
    }
    if (this.filterEndDate) {
      const endDate = new Date(this.filterEndDate);
      result = result.filter(supplier =>
        supplier.createdAt && new Date(supplier.createdAt) <= endDate
      );
    }

    // Filtre par statut bloqué
    if (this.filterBlocked !== 'all') {
      result = result.filter(supplier =>
        this.filterBlocked === 'blocked' ? supplier.blocked : !supplier.blocked
      );
    }

    // Appliquer le tri
    result.sort((a, b) => {
      let valueA, valueB;
      if (this.sortBy === 'username') {
        valueA = a.username.toLowerCase();
        valueB = b.username.toLowerCase();
      } else {
        valueA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        valueB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      }
      const comparison = valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });

    this.filteredSuppliers = result;
    this.currentPage = 1; // Réinitialiser à la première page
  }

  // Réinitialiser les filtres
  resetFilters(): void {
    this.filterUsername = '';
    this.filterEmail = '';
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.filterBlocked = 'all';
    this.sortBy = 'username';
    this.sortOrder = 'asc';
    this.applyFilters();
  }

  // Ouvrir le modal
  openSupplierModal(): void {
    this.isSupplierModalOpen = true;
  }

  // Fermer le modal
  closeSupplierModal(): void {
    this.isSupplierModalOpen = false;
    this.selectedSupplier = null;
  }

  // Ajouter un fournisseur
  addSupplier(newSupplier: User): void {
    this.userService.create(newSupplier).subscribe({
      next: () => {
        this.closeSupplierModal();
        this.loadSuppliers();
      },
      error: (err) => {
        const errorMessage = err.error?.error || 'Une erreur inconnue est survenue.';
        console.error('Erreur lors de l\'ajout du fournisseur:', errorMessage);
        alert(errorMessage);
      }
    });
  }

  // Supprimer un fournisseur
  deleteSupplier(id: number): void {
    this.userService.delete(id).subscribe({
      next: () => {
        this.loadSuppliers();
      },
      error: (err) => {
        console.error('Erreur lors de la suppression du fournisseur', err);
      }
    });
  }

  // Approuver un fournisseur
  approveSupplier(id: number): void {
    console.log('Fournisseur approuvé avec l\'ID:', id);
  }

  // Basculer le statut bloqué/non bloqué
  toggleBlockStatus(supplier: User): void {
    const action = supplier.blocked ? 'débloquer' : 'bloquer';
    const confirmed = confirm(`Êtes-vous sûr de vouloir ${action} "${supplier.username}" ?`);
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
        console.error(`Échec du ${action}:`, err);
        alert(`Échec du ${action} de l'utilisateur.`);
      }
    });
  }

  // Logique de pagination
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

  // Copier dans le presse-papiers
  copyToClipboard(value: string): void {
    navigator.clipboard.writeText(value).then(() => {
      alert('Mot de passe copié dans le presse-papiers !');
    }).catch(err => {
      console.error('Échec de la copie !', err);
    });
  }
}
