import { Component } from '@angular/core';
import type { FormGroup, FormBuilder } from '@angular/forms'; // Solo para tipo
import { Validators } from '@angular/forms'; // Para ejecución
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface IFaq {
  pregunta: string;
  respuesta: string;
  abierto: boolean;
}

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'],
})
export class ContactoComponent {
  public faqs: IFaq[] = [
    {
      pregunta: '¿Cuáles son los métodos de pago aceptados?',
      respuesta: 'Aceptamos tarjetas de crédito, débito y transferencias bancarias.',
      abierto: false,
    },
    {
      pregunta: '¿Cuál es el tiempo de entrega estimado?',
      respuesta: 'El tiempo de entrega varía entre 3-5 días hábiles.',
      abierto: false,
    },
    {
      pregunta: '¿Ofrecen garantía en sus productos?',
      respuesta: 'Sí, todos nuestros productos tienen garantía de 1 año.',
      abierto: false,
    },
    {
      pregunta: '¿Cómo puedo realizar un cambio o devolución?',
      respuesta:
        'Puedes solicitar cambios o devoluciones dentro de los 15 días posteriores a la compra.',
      abierto: false,
    },
  ];

  public contactForm: FormGroup;

  public constructor(private readonly fb: FormBuilder) {
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      mensaje: ['', Validators.required],
    });
  }

  public toggleFaq(index: number): void {
    this.faqs[index].abierto = !this.faqs[index].abierto;
  }

  public submitForm(): void {
    if (this.contactForm.valid) {
      // console.log('Formulario enviado:', this.contactForm.value);
      alert('Formulario enviado con éxito');
      this.contactForm.reset();
    }
  }
}
