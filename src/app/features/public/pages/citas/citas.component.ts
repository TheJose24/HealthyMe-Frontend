import type { OnInit, AfterViewInit, ElementRef, QueryList } from '@angular/core';
import { Component, ViewChildren } from '@angular/core';
import { CommonModule, NgIf, NgClass } from '@angular/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import ScrollReveal from 'scrollreveal';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CitaBookingService } from './services/CitaBookingService.service';
import type { RegisterRequest } from './interfaces/RegisterRequest';
import type { PacienteDTO } from './interfaces/PacienteDTO';
import type { CreatePagoDTO } from './interfaces/CreatePagoDTO';
import type { CitaDTO } from './interfaces/CitaDTO';
import type { EntidadOrigen } from './enums/EntidadOrigen';
import { EstadoCita } from './enums/EstadoCita';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf, NgClass, HttpClientModule],
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.css',
})
export class CitasComponent implements OnInit, AfterViewInit {
  // Private properties
  @ViewChildren('stepContent') private stepContents!: QueryList<ElementRef>;

  // Public properties
  public currentStep: number = 1;
  public patientForm!: FormGroup;
  public specialtyDoctorForm!: FormGroup;
  public dateTimeForm!: FormGroup;
  public paymentForm!: FormGroup;

  public selectedSpecialty: string = '';
  public selectedDoctor: string = '';
  public selectedDoctorId: number = 0;
  public selectedDate: string = '';
  public selectedTime: string = '';
  public totalAmount: number = 150.0;

  // Listas para formularios
  public especialidades: { id: number; nombre: string }[] = [];

  // Agregar para almacenar el ID de la especialidad seleccionada
  public selectedEspecialidadId: number = 0;

  public medicosDisponibles: { id: number; nombre: string }[] = [];
  public metodosPagoDisponibles: { id: number; nombre: string }[] = [];

  public tiposConsulta: string[] = ['Primera consulta', 'Consulta de seguimiento'];
  public sexos: string[] = ['Masculino', 'Femenino', 'Otro'];

  // Calendario
  public currentMonth: Date = new Date();
  public days: (Date | null)[] = [];
  public morningTimes: string[] = ['09:00', '10:00', '11:00'];
  public afternoonTimes: string[] = ['15:00', '16:00', '17:00'];
  public nightTimes: string[] = ['19:00', '20:00'];

  // Estado de la aplicación
  public showModal: boolean = false;
  public modalMessage: string = '';
  public modalType: 'success' | 'error' | 'loading' = 'success';
  public isProcessing: boolean = false;

  // IDs creados durante el proceso
  private usuarioCreado: number = 0;
  private pacienteCreado: number = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private citaBookingService: CitaBookingService
  ) {}

  public ngOnInit(): void {
    window.scrollTo(0, 0);
    this.initializeForms();
    this.setupFormSubscriptions();
    this.generateCalendarDays(this.currentMonth);
    this.loadEspecialidades();
    this.loadMetodosPago();
  }

  public ngAfterViewInit(): void {
    this.stepContents.forEach((el, index) => {
      if (index + 1 !== this.currentStep) {
        el.nativeElement.classList.add('is-hidden');
      }
    });
    this.revealCurrentStep();
  }

  private initializeForms(): void {
    this.patientForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      apellidoPaterno: ['', Validators.required],
      nombre: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      informacionAdicional: [''],
    });

    this.specialtyDoctorForm = this.fb.group({
      especialidad: ['', Validators.required],
      medico: [{ value: '', disabled: true }, Validators.required],
      tipoConsulta: ['', Validators.required],
    });

    this.dateTimeForm = this.fb.group({
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
    });

    this.paymentForm = this.fb.group({
      metodoPago: ['', Validators.required],
      titularTarjeta: ['', Validators.required],
      numeroTarjeta: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      fechaVencimiento: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      guardarDatos: [false],
    });
  }

  /**
   * Cargar especialidades del backend
   */
  private loadEspecialidades(): void {
    this.citaBookingService.getEspecialidades().subscribe({
      next: especialidades => {
        this.especialidades = especialidades;
      },
      error: error => {
        console.error('Error loading especialidades:', error);
        this.showMessageBox('Error al cargar especialidades', 'error');
        // Fallback a especialidades por defecto si hay error
        this.especialidades = [
          { id: 1, nombre: 'Cardiología' },
          { id: 2, nombre: 'Dermatología' },
          { id: 3, nombre: 'Pediatría' },
          { id: 4, nombre: 'Medicina General' },
        ];
      },
    });
  }

  private loadMetodosPago(): void {
    this.citaBookingService.getMetodosPago().subscribe({
      next: metodos => {
        this.metodosPagoDisponibles = metodos;
      },
      error: error => {
        console.error('Error loading payment methods:', error);
        // Fallback a métodos por defecto
        this.metodosPagoDisponibles = [
          { id: 1, nombre: 'Yape' },
          { id: 2, nombre: 'Visa' },
          { id: 3, nombre: 'Mastercard' },
          { id: 4, nombre: 'Paypal' },
        ];
      },
    });
  }

  private setupFormSubscriptions(): void {
    // Especialidad change
    this.specialtyDoctorForm.get('especialidad')?.valueChanges.subscribe(especialidadNombre => {
      const medicoControl = this.specialtyDoctorForm.get('medico');

      if (especialidadNombre) {
        // Encontrar el ID de la especialidad seleccionada
        const especialidadSeleccionada = this.especialidades.find(
          esp => esp.nombre === especialidadNombre
        );

        if (especialidadSeleccionada) {
          this.selectedEspecialidadId = especialidadSeleccionada.id;
          this.selectedSpecialty = especialidadNombre;
          this.loadMedicosByEspecialidadId(especialidadSeleccionada.id);
          medicoControl?.enable();
        }
      } else {
        this.selectedEspecialidadId = 0;
        this.selectedSpecialty = '';
        medicoControl?.disable();
        medicoControl?.setValue('');
        this.medicosDisponibles = [];
      }
    });

    // Médico change
    this.specialtyDoctorForm.get('medico')?.valueChanges.subscribe(medicoNombre => {
      const medico = this.medicosDisponibles.find(m => m.nombre === medicoNombre);
      if (medico) {
        this.selectedDoctor = medico.nombre;
        this.selectedDoctorId = medico.id;
      }
    });

    // Fecha y hora change
    this.dateTimeForm.get('fecha')?.valueChanges.subscribe(date => {
      this.selectedDate = date;
    });

    this.dateTimeForm.get('hora')?.valueChanges.subscribe(time => {
      this.selectedTime = time;
    });
  }

  /**
   * Cargar médicos por ID de especialidad (método principal)
   */
  private loadMedicosByEspecialidadId(idEspecialidad: number): void {
    this.medicosDisponibles = []; // Limpiar lista anterior

    this.citaBookingService.getMedicosByEspecialidadId(idEspecialidad).subscribe({
      next: medicos => {
        this.medicosDisponibles = medicos;
      },
      error: error => {
        console.error('Error loading medicos:', error);
        this.showMessageBox('Error al cargar médicos disponibles', 'error');
        this.medicosDisponibles = [];
      },
    });
  }

  // Métodos de navegación
  public async goToNextStep(): Promise<void> {
    const currentForm = this.getFormGroupForStep(this.currentStep);

    if (currentForm && currentForm.valid) {
      await this.hideStep(this.currentStep);
      this.currentStep++;
      this.revealCurrentStep();
    } else if (currentForm) {
      currentForm.markAllAsTouched();
      this.showMessageBox(
        'Por favor, complete todos los campos requeridos en esta sección.',
        'error'
      );
    }
  }

  public async goToPreviousStep(): Promise<void> {
    if (this.currentStep > 1) {
      await this.hideStep(this.currentStep);
      this.currentStep--;
      this.revealCurrentStep();
    }
  }

  public async goToStep(step: number): Promise<void> {
    if (step === this.currentStep) return;

    let canNavigate = true;
    if (step < this.currentStep) {
      for (let i = step; i < this.currentStep; i++) {
        const form = this.getFormGroupForStep(i);
        if (form && !form.valid) {
          canNavigate = false;
          this.showMessageBox(
            'Para volver a un paso anterior, todos los pasos previos deben estar válidamente completados.',
            'error'
          );
          break;
        }
      }
    } else if (step > this.currentStep) {
      if (!this.isStepValid(this.currentStep)) {
        canNavigate = false;
        this.showMessageBox('Por favor, complete la sección actual antes de avanzar.', 'error');
      }
    }

    if (canNavigate) {
      await this.hideStep(this.currentStep);
      this.currentStep = step;
      this.revealCurrentStep();
    }
  }

  // Métodos del calendario
  public generateCalendarDays(date: Date | null): void {
    if (!date) return;

    this.days = [];
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDay = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;

    for (let i = 0; i < startDay; i++) {
      this.days.push(null);
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      this.days.push(new Date(year, month, i));
    }

    const totalCells = this.days.length;
    const remainingCells = 42 - totalCells;
    if (remainingCells > 0) {
      for (let i = 0; i < remainingCells; i++) {
        this.days.push(null);
      }
    }
  }

  public changeMonth(delta: number): void {
    const newMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + delta,
      1
    );
    this.currentMonth = newMonth;
    this.generateCalendarDays(this.currentMonth);
    this.dateTimeForm.get('fecha')?.setValue('');
    this.dateTimeForm.get('hora')?.setValue('');
  }

  public isToday(date: Date | null): boolean {
    if (date === null) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  public isSelectedDate(date: Date | null): boolean {
    if (date === null || !this.dateTimeForm.get('fecha')?.value) return false;
    const selectedDateString = this.dateTimeForm.get('fecha')?.value;
    const selected = new Date(selectedDateString + 'T00:00:00');
    return (
      date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear()
    );
  }

  public selectDate(date: Date | null): void {
    if (date !== null) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDateMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      selectedDateMidnight.setHours(0, 0, 0, 0);

      if (selectedDateMidnight.getTime() <= today.getTime()) {
        this.showMessageBox(
          'No se puede agendar citas en fechas pasadas o el día actual. Por favor, selecciona una fecha futura.',
          'error'
        );
        this.dateTimeForm.get('fecha')?.setValue('');
        return;
      }

      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      this.dateTimeForm.get('fecha')?.setValue(`${year}-${month}-${day}`);
      this.dateTimeForm.get('hora')?.setValue('');
    }
  }

  public selectTime(time: string): void {
    this.dateTimeForm.get('hora')?.setValue(time);
  }

  // Procesar la cita completa
  public submitAppointment(): void {
    if (this.isProcessing) return;

    this.paymentForm.markAllAsTouched();
    Object.keys(this.paymentForm.controls).forEach(key => {
      const control = this.paymentForm.get(key);
      control?.updateValueAndValidity({ emitEvent: true });
    });

    if (!this.paymentForm.valid) {
      this.showMessageBox(
        'Por favor, complete todos los campos de pago requeridos antes de confirmar la reserva.',
        'error'
      );
      return;
    }

    this.isProcessing = true;
    this.showMessageBox('Procesando su reserva...', 'loading');

    // Iniciar el flujo completo
    this.startBookingProcess();
  }

  private startBookingProcess(): void {
    // Paso 1: Crear usuario
    const registerData = this.buildRegisterRequest();

    this.citaBookingService
      .registerUser(registerData)
      .pipe(finalize(() => (this.isProcessing = false)))
      .subscribe({
        next: userResponse => {
          this.usuarioCreado = userResponse.id;
          this.createPaciente();
        },
        error: error => {
          this.showMessageBox(`Error al registrar usuario: ${error.message}`, 'error');
        },
      });
  }

  private createPaciente(): void {
    // Paso 2: Crear paciente
    const pacienteData: PacienteDTO = {
      id_usuario: this.usuarioCreado,
    };

    this.citaBookingService.createPaciente(pacienteData).subscribe({
      next: pacienteResponse => {
        this.pacienteCreado = pacienteResponse.id!;
        this.processPago();
      },
      error: error => {
        this.showMessageBox(`Error al crear paciente: ${error.message}`, 'error');
      },
    });
  }

  private processPago(): void {
    // Paso 3: Procesar pago
    const metodoPago = this.metodosPagoDisponibles.find(
      m => m.nombre === this.paymentForm.get('metodoPago')?.value
    );
    if (!metodoPago) {
      this.showMessageBox('Método de pago no válido', 'error');
      return;
    }

    const pagoData: CreatePagoDTO = {
      monto: this.totalAmount,
      id_metodo_pago: metodoPago.id,
      entidad_referencia: 'CITA' as EntidadOrigen,
      id_referencia: 1, // Se actualizará con el ID de la cita
      id_paciente: this.pacienteCreado,
    };

    this.citaBookingService.processPago(pagoData).subscribe({
      next: () => {
        this.createCita();
      },
      error: error => {
        this.showMessageBox(`Error al procesar pago: ${error.message}`, 'error');
      },
    });
  }

  private createCita(): void {
    // Paso 4: Crear cita
    const citaData: CitaDTO = {
      fecha: this.selectedDate,
      hora: this.selectedTime + ':00',
      estado: EstadoCita.PENDIENTE,
      id_paciente: this.pacienteCreado,
      id_medico: this.selectedDoctorId,
      id_consultorio: '1',
    };

    this.citaBookingService.createCita(citaData).subscribe({
      next: () => {
        this.showMessageBox('¡Cita reservada con éxito!', 'success');
        setTimeout(() => {
          this.resetFormsAndNavigateToHome();
        }, 2000);
      },
      error: error => {
        this.showMessageBox(`Error al crear cita: ${error.message}`, 'error');
      },
    });
  }

  private buildRegisterRequest(): RegisterRequest {
    const formData = this.patientForm.value;

    // Generar nombre de usuario único
    const nombreUsuario = `${formData.dni}_${Date.now()}`;

    // Generar contraseña temporal
    const contrasena = `temp_${formData.dni}`;

    // Convertir sexo al formato esperado
    const sexoMap: { [key: string]: string } = {
      Masculino: 'M',
      Femenino: 'F',
      Otro: 'M', // Default fallback
    };

    return {
      nombre_usuario: nombreUsuario,
      contrasena,
      dni: formData.dni,
      nombre: formData.nombre,
      apellido: formData.apellidoPaterno,
      fecha_nacimiento: formData.fechaNacimiento,
      email: formData.email,
      telefono: formData.telefono,
      direccion: formData.direccion,
      sexo: sexoMap[formData.sexo] || 'M',
    };
  }

  // Métodos utilitarios
  public showMessageBox(message: string, type: 'success' | 'error' | 'loading'): void {
    this.modalMessage = message;
    this.modalType = type;
    this.showModal = true;
  }

  public closeMessageBox(): void {
    this.showModal = false;
    this.modalMessage = '';
    this.modalType = 'success';
  }

  private revealCurrentStep(): void {
    const targetElement = this.stepContents.find(
      el => parseInt(el.nativeElement.dataset.step, 10) === this.currentStep
    )?.nativeElement;

    if (targetElement) {
      this.stepContents.forEach(el => {
        const elNative = el.nativeElement;
        if (elNative !== targetElement) {
          elNative.classList.remove('active');
          elNative.classList.add('is-hidden');
          ScrollReveal().clean(elNative);
          elNative.style.opacity = '';
          elNative.style.transform = '';
        }
      });

      targetElement.classList.remove('is-hidden');
      ScrollReveal().clean(targetElement);
      targetElement.style.opacity = '';
      targetElement.style.transform = '';

      setTimeout(() => {
        targetElement.classList.add('active');
        ScrollReveal().reveal(targetElement as HTMLElement, {
          delay: 0,
          distance: '50px',
          origin: 'bottom',
          easing: 'ease-in-out',
          scale: 1,
          opacity: 0,
          duration: 800,
        });
      }, 10);
    }
  }

  private hideStep(stepNumber: number): Promise<void> {
    return new Promise(resolve => {
      const contentToHide = this.stepContents.find(
        el => parseInt(el.nativeElement.dataset.step, 10) === stepNumber
      )?.nativeElement;

      if (contentToHide) {
        contentToHide.classList.remove('active');
        setTimeout(() => {
          contentToHide.classList.add('is-hidden');
          resolve();
        }, 550);
      } else {
        resolve();
      }
    });
  }

  private getFormGroupForStep(step: number): FormGroup | null {
    if (step === 1) return this.patientForm;
    if (step === 2) return this.specialtyDoctorForm;
    if (step === 3) return this.dateTimeForm;
    if (step === 4) return this.paymentForm;
    return null;
  }

  private isStepValid(step: number): boolean {
    const form = this.getFormGroupForStep(step);
    return form ? form.valid : false;
  }

  private async resetFormsAndNavigateToHome(): Promise<void> {
    // Reset todos los formularios
    this.patientForm.reset();
    this.specialtyDoctorForm.reset();
    this.dateTimeForm.reset();
    this.paymentForm.reset();

    // Reset variables
    this.selectedSpecialty = '';
    this.selectedDoctor = '';
    this.selectedDoctorId = 0;
    this.selectedDate = '';
    this.selectedTime = '';
    this.usuarioCreado = 0;
    this.pacienteCreado = 0;

    // Navegación
    await this.hideStep(this.currentStep);
    this.router.navigate(['/']);
    window.scrollTo(0, 0);
    this.currentMonth = new Date();
    this.generateCalendarDays(this.currentMonth);
    this.currentStep = 1;
  }
}
