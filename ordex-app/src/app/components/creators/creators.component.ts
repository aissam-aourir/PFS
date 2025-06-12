import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-creators',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './creators.component.html',
})
export class CreatorsComponent {
  creators = [
    // {
    //   fullName: 'MGHIRA Oussama',
    //   imageUrl: 'assets/images/oussama.jpg',
    //   // linkedIn: 'https://www.linkedin.com/in/ali-bensalem',
    //   metier: 'Développeur java Full Stack Junior, spécialisé en Java SE et Spring Boot.'
    // },
    {
      fullName: 'AOURIR Aissam',
      imageUrl: 'assets/images/aissam.jpg',
      // linkedIn: 'https://www.linkedin.com/in/ali-bensalem',
      metier: 'Développeur java Full Stack Junior, spécialisé en Java SE et Spring Boot'
    }
    // ,
    // {
    //   fullName: 'Yassine Khelifi',
    //   imageUrl: 'assets/images/aissam.jpg',
    //   // linkedIn: 'https://www.linkedin.com/in/ali-bensalem',
    //   metier: 'Développeur java Full Stack Junior, spécialisé en Java SE et Spring Boot'
    // }
  ];

  scrollToCreators() {
    const element = document.getElementById('creators');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
