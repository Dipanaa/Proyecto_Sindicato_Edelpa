import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';



@Component({
  selector: 'app-home-carrusel',
  standalone: true,
  imports: [],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home-carrusel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCarrusel implements OnInit {

  //Referencia de Carrousel de Swiper
  @ViewChild('SwiperCarrousel', {static: true}) SwiperCarrousel?: ElementRef<SwiperContainer>;

  ngOnInit(){
    //Inicializacion de propiedades de carrusel
    const opcionesSwiper: SwiperOptions = {
      slidesPerView: 1,
      speed:500,
      loop: true,
      navigation: true
    };

    if(this.SwiperCarrousel){
      Object.assign(this.SwiperCarrousel!.nativeElement, opcionesSwiper);
      this.SwiperCarrousel.nativeElement.initialize();
    }

  }





 }
