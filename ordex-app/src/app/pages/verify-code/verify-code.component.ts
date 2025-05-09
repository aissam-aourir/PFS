import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ToastrModule],
  templateUrl: './verify-code.component.html'
})
export class VerifyCodeComponent {
  verifyCodeForm: FormGroup;
  email: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    // Récupérer l'email depuis l'état de navigation
    const navigation = this.router.getCurrentNavigation();
    this.email = navigation?.extras?.state?.['email'] || null;

    if (!this.email) {
      this.toastr.warning('Aucun email fourni. Veuillez recommencer le processus.', 'Attention');
      this.router.navigateByUrl('/mdp-oublie');
    }

    // Initialisation du formulaire avec tous les champs
    this.verifyCodeForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Validateur personnalisé pour vérifier que les mots de passe correspondent
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  handleVerifyCode() {
    if (this.verifyCodeForm.valid) {
      const { code, password } = this.verifyCodeForm.value; // Ne pas déstructurer email ici
      // Transmettre l'email, le code et le mot de passe au backend
      this.authService.verifyResetCode(code, password, this.email!).subscribe({
        next: (response) => {
          this.toastr.success('Code vérifié avec succès. Mot de passe réinitialisé.', 'Succès', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            toastClass: 'ngx-toastr toast custom-success-toast',
            titleClass: 'toast-title',
            messageClass: 'toast-message'
          });
          this.router.navigateByUrl('/login');
        },
        error: (error) => {
          this.toastr.error(error.error?.error || 'Échec de la vérification du code. Veuillez réessayer.', 'Erreur', {
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
      this.toastr.error('Veuillez remplir correctement tous les champs.', 'Erreur', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        progressBar: true,
        toastClass: 'ngx-toastr toast custom-error-toast',
        titleClass: 'toast-title',
        messageClass: 'toast-message'
      });
    }
  }

  //renvoi d'un code de renitilaisation
  resendCode() {
    if (this.email) {
      this.authService.requestPasswordReset(this.email).subscribe({
        next: (response) => {
          this.toastr.success('Un nouveau code de réinitialisation a été envoyé à votre email.', 'Succès', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            toastClass: 'ngx-toastr toast custom-success-toast',
            titleClass: 'toast-title',
            messageClass: 'toast-message'
          });
        },
        error: (error) => {
          this.toastr.error(error.error?.error || 'Échec de l\'envoi du code. Veuillez réessayer.', 'Erreur', {
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
      this.toastr.error('Aucun email disponible pour renvoyer le code.', 'Erreur', {
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
