import { Component } from '@angular/core';
import type { OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import type { FormGroup, FormBuilder } from '@angular/forms';
import ScrollReveal from 'scrollreveal';

@Component({
  selector: 'app-libro-reclamaciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf],
  templateUrl: './libro-reclamaciones.component.html',
  styleUrl: './libro-reclamaciones.component.css',
})
export class LibroReclamacionesComponent implements OnInit, AfterViewInit {
  // Propiedades de la clase con modificadores de accesibilidad explícitos
  public reclamationForm!: FormGroup;
  public isAffectedUserChecked: boolean = false;
  public departamentos: string[] = ['Lima', 'Arequipa', 'Cusco'];
  public provincias: string[] = ['Lima', 'Cañete', 'Huaral'];
  public distritos: string[] = ['Miraflores', 'San Isidro', 'Surco'];
  public callesTipos: string[] = ['No aplica', 'Calle', 'Avenida', 'Jirón'];
  public tiposReclamante: string[] = [
    'Agraviado',
    'Representante',
    'Abogado',
    'No hay relación',
    'Otro',
  ];
  public tiposRelacion: string[] = ['Titular', 'Familiar', 'Representante Legal', 'Amigo', 'Otro'];

  // Getter para los controles del formulario
  public get formControls(): FormGroup['controls'] {
    return this.reclamationForm.controls;
  }

  // Constructor con modificador de accesibilidad
  constructor(private fb: FormBuilder) {} // 'private' para el solo uso dentro de la clase

  // Métodos del ciclo de vida con modificador de accesibilidad
  public ngOnInit(): void {
    this.reclamationForm = this.fb.group({
      // SECCIÓN 1: IDENTIFICACIÓN DEL USUARIO (PACIENTE) O TERCERO LEGITIMADO
      nombresUsuario: ['', Validators.required],
      apellidoPaternoUsuario: ['', Validators.required],
      apellidoMaternoUsuario: ['', Validators.required],
      departamentoUsuario: ['', Validators.required],
      provinciaUsuario: ['', Validators.required],
      distritoUsuario: ['', Validators.required],

      calleAvJrTipoUsuario: ['', Validators.required],
      calleAvJrValorUsuario: ['', Validators.required],
      nroMzaTipoUsuario: ['', Validators.required],
      nroMzaValorUsuario: ['', Validators.required],
      loteIntTipoUsuario: ['', Validators.required],
      loteIntValorUsuario: ['', Validators.required],
      urbCoopAahhTipoUsuario: ['', Validators.required],
      urbCoopAahhValorUsuario: ['', Validators.required],

      referenciaDomicilioUsuario: [''],
      tipoDocumentoUsuario: ['', Validators.required],
      emailUsuario: ['', [Validators.required, Validators.email]],
      telefonoUsuario: ['', Validators.required],
      sexoUsuario: ['', Validators.required],
      numeroDocumentoUsuario: ['', Validators.required],
      fechaNacimientoUsuario: ['', Validators.required],

      // SECCIÓN 2: IDENTIFICACIÓN DE QUIÉN PRESENTA EL RECLAMO
      esUsuarioAfectado: [false],
      nombresReclamante: ['', Validators.required],
      apellidoPaternoReclamante: ['', Validators.required],
      apellidoMaternoReclamante: ['', Validators.required],
      departamentoReclamante: ['', Validators.required],
      provinciaReclamante: ['', Validators.required],
      distritoReclamante: ['', Validators.required],

      calleAvJrTipoReclamante: ['', Validators.required],
      calleAvJrValorReclamante: ['', Validators.required],
      nroMzaTipoReclamante: ['', Validators.required],
      nroMzaValorReclamante: ['', Validators.required],
      loteIntTipoReclamante: ['', Validators.required],
      loteIntValorReclamante: ['', Validators.required],
      urbCoopAahhTipoReclamante: ['', Validators.required],
      urbCoopAahhValorReclamante: ['', Validators.required],

      referenciaDomicilioReclamante: [''],
      tipoDocumentoReclamante: ['', Validators.required],
      tipoReclamante: ['', Validators.required],
      emailReclamante: ['', [Validators.required, Validators.email]],
      telefonoReclamante: ['', Validators.required],
      sexoReclamante: ['', Validators.required],
      numeroDocumentoReclamante: ['', Validators.required],
      fechaNacimientoReclamante: ['', Validators.required],
      tipoRelacionReclamante: ['', Validators.required],

      // SECCIÓN 3: DETALLE DEL RECLAMO
      fechaOcurrencia: ['', Validators.required],
      sedeOcurrencia: ['', Validators.required],
      tipoProductoServicio: ['', Validators.required],
      descripcionReclamo: ['', [Validators.required, Validators.maxLength(1500)]],

      // SECCIÓN 4: AUTORIZACIÓN Y CONFIRMACIÓN
      autorizaNotificacionEmail: ['', Validators.required],
      declaroDatosReales: [false, Validators.requiredTrue],
    });

    this.reclamationForm.get('esUsuarioAfectado')?.valueChanges.subscribe(value => {
      this.isAffectedUserChecked = value;
      this.toggleReclamanteFields(value);
    });

    this.setupAddressFieldToggle('calleAvJr', 'Usuario');
    this.setupAddressFieldToggle('nroMza', 'Usuario');
    this.setupAddressFieldToggle('loteInt', 'Usuario');
    this.setupAddressFieldToggle('urbCoopAahh', 'Usuario');

    this.setupAddressFieldToggle('calleAvJr', 'Reclamante');
    this.setupAddressFieldToggle('nroMza', 'Reclamante');
    this.setupAddressFieldToggle('loteInt', 'Reclamante');
    this.setupAddressFieldToggle('urbCoopAahh', 'Reclamante');

    this.toggleReclamanteFields(this.reclamationForm.get('esUsuarioAfectado')?.value);
    this.initializeAddressFieldStates();
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      ScrollReveal().reveal('.scroll-animate', {
        delay: 200,
        distance: '50px',
        origin: 'bottom',
        interval: 100,
        easing: 'ease-in-out',
        scale: 1,
        opacity: 0,
        duration: 800,
      });
    }, 0);
  }

  public setupAddressFieldToggle(fieldPrefix: string, userType: string): void {
    const typeControlName = `${fieldPrefix}Tipo${userType}`;
    const valueControlName = `${fieldPrefix}Valor${userType}`;

    this.reclamationForm.get(typeControlName)?.valueChanges.subscribe(value => {
      this.handleAddressTypeChangeFromTS(value, valueControlName);
    });
  }

  public handleAddressTypeChangeFromTS(selectedValue: string, valueControlName: string): void {
    const valueControl = this.reclamationForm.get(valueControlName);
    if (valueControl) {
      if (selectedValue === 'No aplica') {
        valueControl.disable();
        valueControl.patchValue('N/A');
        valueControl.setErrors(null);
      } else {
        valueControl.enable();
        if (valueControl.value === 'N/A') {
          valueControl.patchValue('');
        }
        valueControl.setValidators(Validators.required);
        valueControl.updateValueAndValidity();
      }
    }
  }

  public handleAddressTypeChange(event: Event, valueControlName: string): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.handleAddressTypeChangeFromTS(selectedValue, valueControlName);
  }

  public initializeAddressFieldStates(): void {
    const addressFields = [
      { prefix: 'calleAvJr', type: 'Usuario' },
      { prefix: 'nroMza', type: 'Usuario' },
      { prefix: 'loteInt', type: 'Usuario' },
      { prefix: 'urbCoopAahh', type: 'Usuario' },
      { prefix: 'calleAvJr', type: 'Reclamante' },
      { prefix: 'nroMza', type: 'Reclamante' },
      { prefix: 'loteInt', type: 'Reclamante' },
      { prefix: 'urbCoopAahh', type: 'Reclamante' },
    ];

    addressFields.forEach(field => {
      const typeControlName = `${field.prefix}Tipo${field.type}`;
      const valueControlName = `${field.prefix}Valor${field.type}`;
      const typeControl = this.reclamationForm.get(typeControlName);

      if (typeControl && typeControl.value) {
        this.handleAddressTypeChangeFromTS(typeControl.value, valueControlName);
      }
      if (typeControl?.value === 'No aplica') {
        this.reclamationForm.get(valueControlName)?.setErrors(null);
      }
    });
  }

  public toggleReclamanteFields(isChecked: boolean): void {
    const fieldsToToggle = [
      'nombresReclamante',
      'apellidoPaternoReclamante',
      'apellidoMaternoReclamante',
      'departamentoReclamante',
      'provinciaReclamante',
      'distritoReclamante',
      'calleAvJrTipoReclamante',
      'calleAvJrValorReclamante',
      'nroMzaTipoReclamante',
      'nroMzaValorReclamante',
      'loteIntTipoReclamante',
      'loteIntValorReclamante',
      'urbCoopAahhTipoReclamante',
      'urbCoopAahhValorReclamante',
      'referenciaDomicilioReclamante',
      'tipoDocumentoReclamante',
      'tipoReclamante',
      'emailReclamante',
      'telefonoReclamante',
      'sexoReclamante',
      'numeroDocumentoReclamante',
      'fechaNacimientoReclamante',
      'tipoRelacionReclamante',
    ];

    if (isChecked) {
      fieldsToToggle.forEach(field => {
        const userField = field.replace('Reclamante', 'Usuario');
        const userControl = this.reclamationForm.get(userField);
        const reclamanteControl = this.reclamationForm.get(field);

        if (reclamanteControl) {
          reclamanteControl.disable();
          if (userControl) {
            reclamanteControl.patchValue(userControl.value);
            reclamanteControl.setErrors(null);

            if (field.includes('TipoReclamante')) {
              const valorReclamanteControl = this.reclamationForm.get(
                field.replace('TipoReclamante', 'ValorReclamante')
              );
              const valorUsuarioControl = this.reclamationForm.get(
                userField.replace('TipoUsuario', 'ValorUsuario')
              );
              if (valorReclamanteControl && valorUsuarioControl) {
                valorReclamanteControl.patchValue(valorUsuarioControl.value);
                valorReclamanteControl.disable();
                valorReclamanteControl.setErrors(null);
              }
            }
          } else {
            reclamanteControl.patchValue('');
            reclamanteControl.setErrors(null);
          }
        }
      });
      this.reclamationForm.get('tipoReclamante')?.patchValue('Agraviado');
      this.reclamationForm.get('tipoRelacionReclamante')?.patchValue('Titular');
    } else {
      fieldsToToggle.forEach(field => {
        const control = this.reclamationForm.get(field);
        if (control) {
          control.enable();
          control.patchValue('');
          control.setValidators(Validators.required);
          control.updateValueAndValidity();
        }
      });
      this.initializeAddressFieldStates();
    }
  }

  public onSubmit(): void {
    this.reclamationForm.markAllAsTouched();
    if (this.reclamationForm.valid) {
      // console.log('Formulario válido. Datos:', this.reclamationForm.value);
      alert('¡Reclamo enviado con éxito!');
    } else {
      // console.log('Formulario inválido. Errores:', this.reclamationForm.errors);
      alert('Por favor, completa todos los campos requeridos y corrige los errores.');
    }
  }
}
