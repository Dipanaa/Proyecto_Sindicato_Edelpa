import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { DocumentosService } from '../services/documentos.service';
import { documentosClasificados, documentosInterface } from '../interfaces/documentos.interface';
import { AnimarEnScrollDirective } from '../shared/directives/animar-en-scroll.directive';

@Component({
  selector: 'app-documentos',
  imports: [AnimarEnScrollDirective],
  templateUrl: './documentos.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Documentos {

  //Atributos

  filtroSeleccionado = signal<string>('Todos'); // 'Todos' significa sin filtro específico
  menuFiltrosAbierto = signal<boolean>(false); // Para controlar el menu de tipos

  documentosService = inject(DocumentosService);

  // Filtrar tipos unicos con Set de js mediante datos de Firebase
  tipoDocumentos = computed(() => {
    const data = this.documentosService.recursoDocumentos.value();
    if (!data) return ['Todos'];
    const tipos = new Set(data.map(d => d.tipo));
    return ['Todos', ...Array.from(tipos)];
  });

  documentosDataComputed = computed(() => {
    let data: documentosInterface[] | undefined = this.documentosService.recursoDocumentos.value();
    if (!data) return [];

    // Aplicamos el filtro de tipo
    if (this.filtroSeleccionado() !== 'Todos') {
      data = data.filter(d => d.tipo === this.filtroSeleccionado());
    }

    return this.organizarDocumentos(data);
  });


  //Metodos

  /**
   * Metodo que se encarga de organizar documentos de manera automatica inclusive si hay nuevos tipos.
   * Se usa reduce para crear un objeto y luego se almacena en un array para recorrer
   *
   * @param { documentosInterface[] } data - Data de documentos de firebase.
   * @returns {documentosClasificados[]} - Devuelve un array de documentos organizados
   */
  organizarDocumentos(data: documentosInterface[]): documentosClasificados[] {
    const dataDocumentos: documentosClasificados[] = [];
    const documentos = data.reduce((acum, actual) => {

      if (!acum[actual.tipo]) {
        acum[actual.tipo] = [];
      }
      acum[actual.tipo].push(actual);
      return acum;

    }, {} as Record<string, documentosInterface[]>)

    for (let clave in documentos) {
      dataDocumentos.push({ tipo: clave, documentos: documentos[clave] })
    }
    return dataDocumentos
  };

  /**
   * Fuerza la descarga de un archivo (como un PDF) procesando su URL. 
   * Si las politicas de CORS bloquean la descarga directa en segundo plano,
   * automáticamente abre el link en una pestaña nueva como plan B.
   */
  async descargarPdf(url: string, nombreAgregado: string) {
    try {
      // Intentamos descargarlo en segundo plano para forzar el guardado y no solo la previsualización
      const response = await fetch(url);

      if (!response.ok) throw new Error("Fallo en red o CORS");

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = objectUrl;
      // Validamos no repetir ".pdf.pdf"
      a.download = nombreAgregado.toLowerCase().endsWith('.pdf') ? nombreAgregado : `${nombreAgregado}.pdf`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(objectUrl);

    } catch (error) {
      console.warn('Política del servidor previene descarga forzosa directa. Abriendo en nueva pestaña...', error);
      // Fallback seguro: Que el navegador decida abrirlo o descargarlo directo
      const aFallback = document.createElement('a');
      aFallback.href = url;
      aFallback.target = '_blank';
      aFallback.download = nombreAgregado.toLowerCase().endsWith('.pdf') ? nombreAgregado : `${nombreAgregado}.pdf`;
      document.body.appendChild(aFallback);
      aFallback.click();
      document.body.removeChild(aFallback);
    }
  }

}



