import { inject, Injectable } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  collection,
  collectionData,
  Firestore,
  query,
  where,
  getCountFromServer,
  limit,
  startAfter,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
  queryEqual
} from '@angular/fire/firestore';
import { defer, forkJoin, from, map, Observable, of } from 'rxjs';
import { GaleriaInterface, CategoriaConteo, subCarpetaImagenes } from '../interfaces/galeria.interface';

@Injectable({
  providedIn: 'root'
})
export class GaleriaService {

  private firestore: Firestore = inject(Firestore);


  //Recursos
  //Metodos
  /**
   * Obtiene una página de imágenes usando Observables.
   */
  obtenerImagenesPaginadas(nombreCarpeta: string, limite: number,
    ultimoDoc: QueryDocumentSnapshot<DocumentData> | null): Observable<{
      data: GaleriaInterface[],
      lastVisible: QueryDocumentSnapshot<DocumentData> | null
    }> {
    const coleccionRef = collection(this.firestore, 'galeria');
    const reglas: any[] = [limit(limite)];

    reglas.push(where('nombreCarpeta', '==', nombreCarpeta));

    if (ultimoDoc) {
      reglas.push(startAfter(ultimoDoc));
    }

    const queryFirebase = query(coleccionRef, ...reglas);

    // Convertimos el Promise de getDocs a un Observable
    return from(getDocs(queryFirebase)).pipe(
      map(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GaleriaInterface));
        const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
        return { data, lastVisible };
      })
    );
  }


  /**
   * Obtiene las imágenes de una sección específica (sin paginación).
   */
  obtenerImagenesPorSeccion(seccion: string): Observable<GaleriaInterface[]> {
    const q = seccion.toLowerCase() === 'todos'
      ? collection(this.firestore, 'galeria')
      : query(collection(this.firestore, 'galeria'), where('tipo', '==', seccion.toLowerCase()));

    return collectionData(q) as Observable<GaleriaInterface[]>;
  }

  /*
    Obtener imagenes en base a sub carpetas
  */
  async obtenerSubCarpetasImagenes() {
    const coleccionSubCarpetas = collection(this.firestore, 'tiposCarpetaImagenes');
    const queryFirebase = query(coleccionSubCarpetas);
    const data = await getDocs(queryFirebase);
    const dataMap = data.docs.map(doc => ({ id: doc.id, ...doc.data() } as subCarpetaImagenes));
    return dataMap;
  }

}
