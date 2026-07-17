import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Home } from './home/home';
import { Sindicato } from './sindicato/sindicato';
import { Galeria } from './galeria/galeria';
import { Deporte } from './deporte/deporte';
import { Bienestar } from './bienestar/bienestar';
import { Documentos } from './documentos/documentos';
import { Caja18 } from './caja-18/caja-18.component';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      // default child route redirects to home
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Home },
      { path: 'sindicato', component: Sindicato },
      {
        path: 'galeria',
        children: [
          { path: '', component: Galeria },
          {
            path: ':section',
            loadComponent: () =>
              import('./galeria/active-page/active-page.component').then(
                (m) => m.ActivePage
              ),
          },
        ],
      },
      { path: 'deporte', component: Deporte },
      { path: 'bienestar', component: Bienestar },
      { path: 'documentos', component: Documentos },
      { path: 'caja18', component: Caja18 }

    ],
  },
  { path: '**', redirectTo: 'home' },
];