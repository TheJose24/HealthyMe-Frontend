import type { OnInit, AfterViewInit, ElementRef, QueryList } from '@angular/core';
import { Component, ViewChildren } from '@angular/core';
import { CommonModule, NgIf, NgClass } from '@angular/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule, Validators } from '@angular/forms';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Router } from '@angular/router'; // Import Router
import ScrollReveal from 'scrollreveal';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf, NgClass],
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.css',
})
export class CitasComponent implements OnInit, AfterViewInit {
  // Private properties - moved to the top as per member-ordering lint rule
  @ViewChildren('stepContent') private stepContents!: QueryList<ElementRef>;

  // Public properties
  public currentStep: number = 1;
  public patientForm!: FormGroup;
  public specialtyDoctorForm!: FormGroup;
  public dateTimeForm!: FormGroup;
  public paymentForm!: FormGroup;

  public selectedSpecialty: string = '';
  public selectedDoctor: string = '';
  public selectedDate: string = '';
  public selectedTime: string = '';
  public totalAmount: number = 150.0; // Example amount, set to a default value

  public especialidades: string[] = [
    'Cardiología',
    'Dermatología',
    'Pediatría',
    'Medicina General',
  ];
  public medicos: { [key: string]: string[] } = {
    Cardiología: ['Dr. Juan Pérez', 'Dra. Ana Gómez'],
    Dermatología: ['Dr. Luis Martínez', 'Dra. Laura Sánchez'],
    Pediatría: ['Dr. Carlos Díaz', 'Dra. Sofía Torres'],
    'Medicina General': ['Dr. Roberto Vega', 'Dra. María Flores'],
  };
  public tiposConsulta: string[] = ['Primera consulta', 'Consulta de seguimiento'];
  public sexos: string[] = ['Masculino', 'Femenino', 'Otro'];

  public currentMonth: Date = new Date();
  public days: (Date | null)[] = [];
  public morningTimes: string[] = ['09:00', '10:00', '11:00'];
  public afternoonTimes: string[] = ['15:00', '16:00', '17:00'];
  public nightTimes: string[] = ['19:00', '20:00'];

  public showModal: boolean = false;
  public modalMessage: string = '';
  public modalType: 'success' | 'error' = 'success';

  // Constructor
  public constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  // Lifecycle Hooks
  public ngOnInit(): void {
    // Scroll to the top of the page when the component initializes
    window.scrollTo(0, 0);

    // Initialize form groups
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
      fechaVencimiento: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]], // MM/YY
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      guardarDatos: [false],
    });

    // Generate calendar days for the current month
    this.generateCalendarDays(this.currentMonth);

    // Subscribe to changes in specialty to update doctor list and enable/disable medico control
    this.specialtyDoctorForm.get('especialidad')?.valueChanges.subscribe(specialty => {
      const medicoControl = this.specialtyDoctorForm.get('medico');
      if (specialty) {
        medicoControl?.enable();
      } else {
        medicoControl?.disable();
        medicoControl?.setValue('');
      }
      this.selectedSpecialty = specialty;
    });

    // Subscribe to changes in doctor to update selected doctor for summary
    this.specialtyDoctorForm.get('medico')?.valueChanges.subscribe(doctor => {
      this.selectedDoctor = doctor;
    });

    // Subscribe to changes in date and time for summary
    this.dateTimeForm.get('fecha')?.valueChanges.subscribe(date => {
      this.selectedDate = date;
    });

    this.dateTimeForm.get('hora')?.valueChanges.subscribe(time => {
      this.selectedTime = time;
    });
  }

  public ngAfterViewInit(): void {
    // Hide all steps initially except the current one (step 1)
    this.stepContents.forEach((el, index) => {
      if (index + 1 !== this.currentStep) {
        el.nativeElement.classList.add('is-hidden');
      }
    });
    this.revealCurrentStep(); // Reveal the initial step
  }

  // Public Methods
  public async goToNextStep(): Promise<void> {
    const currentForm = this.getFormGroupForStep(this.currentStep);

    if (currentForm && currentForm.valid) {
      await this.hideStep(this.currentStep);
      this.currentStep++;
      this.revealCurrentStep();
    } else if (currentForm) {
      currentForm.markAllAsTouched(); // Show validation errors for current form
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
    if (step === this.currentStep) {
      return;
    }

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

  public showMessageBox(message: string, type: 'success' | 'error'): void {
    this.modalMessage = message;
    this.modalType = type;
    this.showModal = true;
  }

  public closeMessageBox(): void {
    this.showModal = false;
    this.modalMessage = '';
    this.modalType = 'success'; // Reset to default
  }

  public submitAppointment(): void {
    this.paymentForm.markAllAsTouched();

    Object.keys(this.paymentForm.controls).forEach(key => {
      const control = this.paymentForm.get(key);
      if (control) {
        control.updateValueAndValidity({ emitEvent: true });
      }
    });

    if (this.paymentForm.valid) {
      this.showMessageBox('¡Cita reservada con éxito!', 'success');
      setTimeout(() => {
        this.resetFormsAndNavigateToHome();
      }, 1000);
    } else {
      this.showMessageBox(
        'Por favor, complete todos los campos de pago requeridos antes de confirmar la reserva.',
        'error'
      );
    }
  }

  // Private Methods
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
    this.patientForm.reset(
      {
        dni: '',
        apellidoPaterno: '',
        nombre: '',
        fechaNacimiento: '',
        sexo: '',
        direccion: '',
        telefono: '',
        email: '',
        informacionAdicional: '',
      },
      { emitEvent: false }
    );

    this.specialtyDoctorForm.reset(
      {
        especialidad: '',
        medico: '',
        tipoConsulta: '',
      },
      { emitEvent: false }
    );
    this.specialtyDoctorForm.get('medico')?.disable({ emitEvent: false });

    this.dateTimeForm.reset(
      {
        fecha: '',
        hora: '',
      },
      { emitEvent: false }
    );

    this.paymentForm.reset(
      {
        metodoPago: '',
        titularTarjeta: '',
        numeroTarjeta: '',
        fechaVencimiento: '',
        cvv: '',
        guardarDatos: false,
      },
      { emitEvent: false }
    );

    this.selectedSpecialty = '';
    this.selectedDoctor = '';
    this.selectedDate = '';
    this.selectedTime = '';

    await this.hideStep(this.currentStep);

    this.router.navigate(['/']);

    window.scrollTo(0, 0);

    this.currentMonth = new Date();
    this.generateCalendarDays(this.currentMonth);

    this.currentStep = 1;
  }
}
