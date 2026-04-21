import { Component, HostListener, inject, signal, effect, OnInit, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GaleriaService } from '../../services/galeria.service';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { GaleriaInterface } from '../../interfaces/galeria.interface';
import { QueryDocumentSnapshot, DocumentData } from '@angular/fire/firestore';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import { finalize } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-active-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './active-page.component.html',
})
export class ActivePage implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private galeriaService = inject(GaleriaService);

  // Capturamos los parámetros de la ruta como una señal reactiva
  private routeParams = toSignal(this.route.params);

  // Señal computada para obtener el nombre de la sección desde la URL
  sectionName = computed(() => this.routeParams()?.['section'] || '');

  // Estados de carga e imágenes usando señales
  imagenes = signal<GaleriaInterface[]>([]);
  ultimoDoc = signal<QueryDocumentSnapshot<DocumentData> | null>(null);
  cargando = signal<boolean>(false);
  hayMas = signal<boolean>(true);
  qrUrl = signal<string | null>(null);
  qrModalOpen = signal<boolean>(false);

  private lightbox: PhotoSwipeLightbox | null = null;

  ngOnInit() {
    this.resetGallery(this.sectionName());
    this.initLightbox();
    this.cargarQrUrl(this.sectionName());
  }

  ngOnDestroy() {
    if (this.lightbox) {
      this.lightbox.destroy();
      this.lightbox = null;
    }
  }

  initLightbox() {
    this.lightbox = new PhotoSwipeLightbox({
      gallery: '#gallery-active-page',
      children: 'a',
      pswpModule: () => import('photoswipe')
    });
    this.lightbox.init();
  }

  async cargarQrUrl(section: string) {
    try {
      const carpetas = await this.galeriaService.obtenerSubCarpetasImagenes();
      const carpeta = carpetas.find(c => c.nombre.toLowerCase() === section.toLowerCase());
      if (carpeta && carpeta.urlQrCodigo) {
        this.qrUrl.set(carpeta.urlQrCodigo);
      }
    } catch (e) {
      console.error('Error cargando QR:', e);
    }
  }

  //Reseteo de la galeria de imagenes
  resetGallery(section: string) {
    this.imagenes.set([]);
    this.ultimoDoc.set(null);
    this.hayMas.set(true);
    this.cargarMas(section);
  }

  /**
   * Carga de imágenes usando Observables (RxJS)
   */
  cargarMas(section: string) {
    if (this.cargando() || !this.hayMas()) return;

    this.cargando.set(true);

    this.galeriaService.obtenerImagenesPaginadas(section, 10, this.ultimoDoc())
      .pipe(
        finalize(() => this.cargando.set(false))
      )
      .subscribe({
        next: (result) => {
          this.imagenes.update(prev => [...prev, ...result.data]);
          this.ultimoDoc.set(result.lastVisible);

          if (result.data.length < 10) {
            this.hayMas.set(false);
          }
        },
        error: (err) => {
          console.error('Error cargando imágenes:', err);
        }
      });
  }

  @HostListener('window:scroll', [])
  onScroll() {
    const pos = (window.innerHeight + window.scrollY);
    const max = document.body.offsetHeight;

    if (pos >= max - 300) {
      this.cargarMas(this.sectionName());
    }
  }

  /**
   * Actualiza dinámicamente el tamaño de la imagen en PhotoSwipe
   * para evitar que las imágenes se aplasten
   */
  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img) {
      const a = img.closest('a');
      if (a) {
        a.setAttribute('data-pswp-width', img.naturalWidth.toString());
        a.setAttribute('data-pswp-height', img.naturalHeight.toString());
      }
    }
  }
}
