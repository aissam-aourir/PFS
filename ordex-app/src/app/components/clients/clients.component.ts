import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.component.html'
})
export class ClientsComponent implements OnInit {
  clients: User[] = [];
  filteredClients: User[] = [];
  paginatedClients: User[] = [];

  currentPage = 1;
  pageSize = 8;
  totalPages = 0;

  searchQuery = '';
  filterStatus: 'all' | 'blocked' | 'active' = 'all';

  constructor(private userService: UserService, private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getAll().subscribe((clients) => {
      this.clients = clients;
      this.applyFilters();
    });
  }

  approveClient(clientId: number) {
    console.log('Approving client ID:', clientId);
  }

  blockClient(client: User) {
    const action = client.blocked ? 'unblock' : 'block';
    const confirmed = confirm(`Confirmer ${action} de ${client.username} ?`);
    if (!confirmed) return;

    const request = client.blocked
      ? this.userService.unblockUser(client.username)
      : this.userService.blockUser(client.username);

    request.subscribe({
      next: () => {
        client.blocked = !client.blocked;
        this.loadClients();
      },
      error: (err) => {
        console.error(`Erreur lors de ${action}:`, err);
        alert(`Échec de ${action} l'utilisateur.`);
      }
    });
  }

  deleteClient(clientId: number) {
    console.log('Suppression client ID:', clientId);
  }

  applyFilters() {
    this.filteredClients = this.clients.filter(client => {
      const matchesSearch =
        client.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesStatus =
        this.filterStatus === 'all' ||
        (this.filterStatus === 'blocked' && client.blocked) ||
        (this.filterStatus === 'active' && !client.blocked);

      return matchesSearch && matchesStatus;
    });

    this.totalPages = Math.ceil(this.filteredClients.length / this.pageSize);
    this.currentPage = 1;
    this.paginateClients();
  }

  paginateClients() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedClients = this.filteredClients.slice(start, end);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateClients();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateClients();
    }
  }

  onSearchChange() {
    this.applyFilters();
  }

  onFilterStatusChange() {
    this.applyFilters();
  }
}
