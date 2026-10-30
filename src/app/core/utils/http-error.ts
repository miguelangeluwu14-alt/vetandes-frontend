import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponse } from '../models/error-response';
export function mensajeError(err: HttpErrorResponse): string {
  if (err.status === 0) return 'No se puede comunicar con VetAndes API. Confirme que Spring Boot funcione en el puerto 8080.';
  const cuerpo = err.error as ErrorResponse | null;
  return cuerpo?.mensaje || (err.status === 403 ? 'No tiene permiso para realizar esta acción.' : `Error HTTP ${err.status}: ${err.statusText}`);
}
export function erroresDeValidacion(err: HttpErrorResponse): Record<string,string> {return (err.error as ErrorResponse | null)?.campos ?? {};}
