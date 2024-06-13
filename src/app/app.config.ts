import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideFirebaseApp(() => initializeApp({ "projectId": "danotes-bbc8f", "appId": "1:739830414096:web:c0505c304bd2be67cd0395", "storageBucket": "danotes-bbc8f.appspot.com", "apiKey": "AIzaSyBxrLpvKGzfNFD7mpYNkDWWoEVl6Rd62U8", "authDomain": "danotes-bbc8f.firebaseapp.com", "messagingSenderId": "739830414096" })), provideFirestore(() => getFirestore())]
};
