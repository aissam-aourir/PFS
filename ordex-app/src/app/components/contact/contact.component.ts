import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  standalone: true,
  imports: [RouterLink, FormsModule]
})
export class ContactComponent implements OnInit {
  formData = {
    name: '',
    email: '',
    subject: '',
    message: '',
    to_name: 'Aissam'
  };
  loading = false;
  errorMessage = '';
  sentMessage = '';

  ngOnInit(): void {
    emailjs.init('b-vg0hOixDAxb0Axi');
  }

  sendEmail(): void {
    this.loading = true;
    this.errorMessage = '';
    this.sentMessage = '';

    emailjs.send('service_jqlr7wl', 'template_e5prh3c', this.formData)
      .then((response: EmailJSResponseStatus) => {
        console.log('SUCCESS!', response.status, response.text);
        this.loading = false;
        this.sentMessage = 'Votre message a été envoyé. Merci!';
        this.resetForm();
      }, (error: any) => {
        console.error('FAILED...', error);
        this.loading = false;
        this.errorMessage = 'Une erreur s\'est produite. Veuillez réessayer.';
      });
  }

  private resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      subject: '',
      message: '',
      to_name: 'Aissam'
    };
  }
}
