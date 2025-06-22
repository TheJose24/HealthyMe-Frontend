import type { OnInit, AfterViewInit } from '@angular/core';
import { Component } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Router, ActivatedRoute } from '@angular/router';
import ScrollReveal from 'scrollreveal';
import type { IUnidad } from './unidad';
import { UNIDADES } from './unidad';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unidades-especializadas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './especializadas.component.html',
  styleUrls: ['./especializadas.component.css'],
})
export class EspecialidadComponent implements OnInit, AfterViewInit {
  public especialidades: IUnidad[] = [];

  public constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    window.scrollTo({ top: 0 });
    this.especialidades = UNIDADES;
  }

  public ngAfterViewInit(): void {
    const sr = ScrollReveal({
      distance: '50px',
      duration: 800,
      easing: 'ease-out',
      origin: 'bottom',
      reset: false,
    });
    sr.reveal('.sr-hero', {
      origin: 'top',
      distance: '80px',
      duration: 1000,
    });
    sr.reveal('.card-sr', {
      interval: 150,
    });
  }

  public irADetalle(slug: string): void {
    this.router.navigate([slug], { relativeTo: this.route });
  }
}
