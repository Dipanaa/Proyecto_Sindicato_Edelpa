export interface GaleriaInterface {
  id: string;
  nombre?: string;
  tipo: string;
  url: string;
}

export interface CategoriaConteo {
  nombre: string;
  cantidad: number;
}

export interface subCarpetaImagenes {
  id?: string;
  cantImagenes: number;
  nombre: string;
  tipo: string;
  urlQrCodigo: string;
  urlPortada: string;

}
