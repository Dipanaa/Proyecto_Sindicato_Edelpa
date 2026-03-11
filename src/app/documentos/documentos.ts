import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-documentos',
  imports: [],
  templateUrl: './documentos.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Documentos {

  //Atributos

  //TODO: Cambiar logica cuando se obtengan archivos (Agregar interfaces y anidacion).
  listaTiposDocumentos: Array<string> = ["Documentación legal", "Comunicaciones internas", "Protocolo de seguridad"];

}
