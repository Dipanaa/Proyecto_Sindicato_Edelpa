import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { register } from 'swiper/element/bundle';

//Inicializacion de Swiper
register();

//Angular por defecto
bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    // 1. Configuramos el IntersectionObserver (lo que activa la animación)
    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const animation = el.getAttribute('data-animation') || 'animate__fadeInUp';
          const delay = el.getAttribute('data-delay') || '0s';
          const duration = el.getAttribute('data-duration') || '1s';

          el.style.animationDelay = delay;
          el.style.animationDuration = duration;
          el.style.visibility = 'visible';
          el.classList.add('animate__animated', animation);
          intersectionObserver.unobserve(el);
        }
      });
    }, { threshold: 0.1 });

    // Función para empezar a observar elementos con la clase 'reveal'
    const setupReveal = (container: ParentNode) => {
      container.querySelectorAll('.reveal').forEach(el => {
        const htmlEl = el as HTMLElement;
        if (!htmlEl.style.visibility) {
          htmlEl.style.visibility = 'hidden';
          intersectionObserver.observe(htmlEl);
        }
      });
    };

    // 2. Ejecutamos la carga inicial
    setupReveal(document);

    // 3. Usamos MutationObserver para detectar nuevos elementos dinámicos
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) setupReveal(node as ParentNode);
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });
  })
  .catch(err => console.error(err));
