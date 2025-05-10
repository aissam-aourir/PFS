import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verify-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ToastrModule],
  templateUrl: './verify-register.component.html'
})
export class VerifyRegisterComponent {
  verifyRegisterForm: FormGroup;
  email: string | null = null;
  username: string | null = null;
  password: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.email = navigation?.extras?.state?.['email'] || null;
    this.username = navigation?.extras?.state?.['username'] || null;
    this.password = navigation?.extras?.state?.['password'] || null;

    if (!this.email || !this.username || !this.password) {
      this.toastr.warning('Données manquantes. Veuillez recommencer le processus.', 'Attention');
      this.router.navigateByUrl('/register');
    }

    this.verifyRegisterForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  handleVerifyRegister() {
    if (this.verifyRegisterForm.valid && this.email && this.username && this.password) {
      const { code } = this.verifyRegisterForm.value;
      this.authService.verifyRegisterCode(this.email, code, this.username, this.password).subscribe({
        next: (response) => {
          this.toastr.success('Inscription confirmée avec succès.', 'Succès', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            toastClass: 'ngx-toastr toast custom-success-toast',
            titleClass: 'toast-title',
            messageClass: 'toast-message'
          });
          this.authService.loadProfile(response);
          this.router.navigateByUrl('/login');
        },
        error: (error) => {
          this.toastr.error(error.error?.error || 'Échec de la vérification du code.', 'Erreur', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            toastClass: 'ngx-toastr toast custom-error-toast',
            titleClass: 'toast-title',
            messageClass: 'toast-message'
          });
        }
      });
    } else {
      this.toastr.error('Veuillez entrer un code valide (6 chiffres).', 'Erreur', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        progressBar: true,
        toastClass: 'ngx-toastr toast custom-error-toast',
        titleClass: 'toast-title',
        messageClass: 'toast-message'
      });
    }
  }

  resendCode() {
    if (this.email && this.username && this.password) {
      this.authService.verifyRegister(this.username, this.email, this.password).subscribe({
        next: (response) => {
          this.toastr.success('Un nouveau code de vérification a été envoyé à votre email.', 'Succès', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            toastClass: 'ngx-toastr toast custom-success-toast',
            titleClass: 'toast-title',
            messageClass: 'toast-message'
          });
        },
        error: (error) => {
          this.toastr.error(error.error?.error || 'Échec de l\'envoi du code.', 'Erreur', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            toastClass: 'ngx-toastr toast custom-error-toast',
            titleClass: 'toast-title',
            messageClass: 'toast-message'
          });
        }
      });
    } else {
      this.toastr.error('Données manquantes pour renvoyer le code.', 'Erreur', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        progressBar: true,
        toastClass: 'ngx-toastr toast custom-error-toast',
        titleClass: 'toast-title',
        messageClass: 'toast-message'
      });
    }
  }
}
