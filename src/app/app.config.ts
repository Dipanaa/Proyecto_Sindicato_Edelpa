import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app';
import { provideAppCheck, ReCaptchaEnterpriseProvider, initializeAppCheck } from '@angular/fire/app-check';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

//Servicio firebase

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => {
      return initializeFirestore(getApp(), {
        localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
      })
    }),
    provideAppCheck(() => {
      if (isDevMode()) {
        (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
      }
      const provider = new ReCaptchaEnterpriseProvider('6LeqsMssAAAAAIZTp7zGqY0aIKpj7J6PVE0icrL0');
      return initializeAppCheck(undefined, { provider, isTokenAutoRefreshEnabled: true });
    })
  ]
};
