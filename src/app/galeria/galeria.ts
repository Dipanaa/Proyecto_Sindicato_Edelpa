import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GaleriaService } from '../services/galeria.service';
import { GaleriaInterface, CategoriaConteo, subCarpetaImagenes } from '../interfaces/galeria.interface';
import { Router, RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { AnimarEnScrollDirective } from '../shared/directives/animar-en-scroll.directive';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule, RouterLink, AnimarEnScrollDirective],
  templateUrl: './galeria.html'
})
export class Galeria {

  //Servicios
  galeriaService = inject(GaleriaService);
  router = inject(Router);

  //Atributos
  categorias: string[] = ['todos', 'deportivo', 'sindicato', 'bienestar'];
  cargaSubCarpetas = false;
  dataSubCarpetas = signal<subCarpetaImagenes[] | null>(null);
  categoriaActiva = signal<string>('todos');

  constructor() {
    this.cargarSubCarpetas();
  }

  //Metodos
  dataSubCarpetasFiltradas = computed(() => {
    const data = this.dataSubCarpetas();
    if (!data) return null;

    const categoria = this.categoriaActiva();
    if (categoria === 'todos') return data;

    return data.filter(item => item.tipo.toLowerCase() === categoria.toLowerCase());
  });

  cambiarCategoria(cat: string) {
    this.categoriaActiva.set(cat);
  }

  cargarSubCarpetas() {
    if (this.cargaSubCarpetas) return;

    this.cargaSubCarpetas = true;

    this.galeriaService.obtenerSubCarpetasImagenes().then(data => {
      this.dataSubCarpetas.set(data);
      this.cargaSubCarpetas = false;
    }).catch(err => {
    });
  }

}
