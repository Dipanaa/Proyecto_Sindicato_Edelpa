import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appAnimarEnScroll]',
  standalone: true
})
export class AnimarEnScrollDirective implements OnInit, OnDestroy {
  @Input('appAnimarEnScroll') animationClass: string = 'animate__fadeInUp';

  private observer: IntersectionObserver | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    // Aseguramos que inicialmente sea invisible antes de la animación para no ver un "flash"
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');

    const options = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.15
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Remover opacidad manual para que la clase animate.css la controle
          this.renderer.removeStyle(this.el.nativeElement, 'opacity');
          this.renderer.addClass(this.el.nativeElement, 'animate__animated');
          this.renderer.addClass(this.el.nativeElement, this.animationClass);
          this.observer?.unobserve(this.el.nativeElement);
        }
      });
    }, options);

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
