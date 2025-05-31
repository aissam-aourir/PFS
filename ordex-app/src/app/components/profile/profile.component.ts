import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [
    RouterLink
  ],
  standalone: true
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Récupérer les informations de l'utilisateur à partir du token JWT
    this.user = {
      username: this.authService.username || '',
      email: this.authService.email || '',
      password: '', // Ne pas afficher le mot de passe pour des raisons de sécurité
      createdAt:  new Date(), // À remplacer par une récupération réelle si disponible
    };
  }
}
