import type { OnInit, AfterViewInit } from '@angular/core';
import { Component } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import ScrollReveal from 'scrollreveal';
import type { IUnidad } from './unidad';
import { UNIDADES } from './unidad';

@Component({
  selector: 'app-detalle-unidad',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detalle-unidad.component.html',
})
export class DetalleUnidadComponent implements OnInit, AfterViewInit {
  public unidad: IUnidad | undefined;

  public constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  public ngOnInit(): void {
    window.scrollTo({ top: 0 });
    const slug = this.route.snapshot.paramMap.get('slug');
    this.unidad = UNIDADES.find(u => u.slug === slug!)!;
  }

  public ngAfterViewInit(): void {
    const sr = ScrollReveal({
      distance: '50px',
      duration: 800,
      easing: 'ease-out',
      reset: false,
    });

    sr.reveal('.sr-hero-detail', { origin: 'top', distance: '80px' });

    sr.reveal('.sr-features', { origin: 'right', distance: '50px', delay: 200 });

    sr.reveal('.sr-stats', { origin: 'bottom', interval: 100 });

    sr.reveal('.sr-faq', { origin: 'left', interval: 150 });

    sr.reveal('.sr-cta', { origin: 'bottom', distance: '60px', delay: 300 });
  }

  public goBack(): void {
    this.router.navigate(['/unidades-especializadas']);
  }
}
