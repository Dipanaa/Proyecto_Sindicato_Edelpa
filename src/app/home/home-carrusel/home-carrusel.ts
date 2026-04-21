import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnInit,
  ViewChild,
  inject
} from '@angular/core';
import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';
import { AvisosService, Aviso } from '../../services/avisos.service';

@Component({
  selector: 'app-home-carrusel',
  standalone: true,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home-carrusel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCarrusel implements OnInit {
  listaAvisos: Aviso[] = [];

  private avisosService = inject(AvisosService);
  private cdr = inject(ChangeDetectorRef);

  //Referencia de Carrousel de Swiper
  @ViewChild('SwiperCarrousel', { static: true })
  SwiperCarrousel?: ElementRef<SwiperContainer>;

  ngOnInit() {
    //Inicializacion de propiedades de carrusel
    const opcionesSwiper: SwiperOptions = {
      injectStyles: [
        `
        :host {
          --swiper-navigation-color: gray;
        }
        .swiper-button-next,
        .swiper-button-prev{
          opacity:0.2;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover{
          opacity:0.5;
        }

        `,
      ],
      slidesPerView: 1,
      speed: 500,
      loop: true,
      navigation: true,
      autoplay: true
    };

    if (this.SwiperCarrousel) {
      Object.assign(this.SwiperCarrousel!.nativeElement, opcionesSwiper);
    }

    this.avisosService.getAvisos().subscribe((avisos) => {
      this.listaAvisos = avisos;
      this.cdr.markForCheck();

      // Init or update swiper once DOM is updated
      setTimeout(() => {
        if (this.SwiperCarrousel && !this.SwiperCarrousel.nativeElement.swiper) {
          this.SwiperCarrousel.nativeElement.initialize();
        } else if (this.SwiperCarrousel?.nativeElement.swiper) {
          this.SwiperCarrousel.nativeElement.swiper.update();
        }
      });
    });
  }
}
