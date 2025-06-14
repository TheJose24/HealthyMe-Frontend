/* eslint-disable prettier/prettier */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-doctores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctores.component.html',
  styleUrls: ['./doctores.component.css'],
})
export class DoctoresComponent {
  doctores = [
    { image: '/assets/images/doctores/doctor-juan.jpg', name: 'Juan Quispe Mamani' },
    { image: '/assets/images/doctores/doctor-angeles.jpg', name: 'Angeles del Campo Avalos' },
    { image: '/assets/images/doctores/doctor-piero.jpg', name: 'Piero Quispe Rubiales ' },
  ];
  constructor() {}
}
