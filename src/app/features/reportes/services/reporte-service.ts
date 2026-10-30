import {Injectable,inject} from '@angular/core';
import {HttpClient,HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {ReporteEspecie} from '../models/reporte.model';
@Injectable({providedIn:'root'})
export class ReporteService {
 private http=inject(HttpClient);
 porEspecie(desde?:string,hasta?:string){let params=new HttpParams();if(desde)params=params.set('desde',desde);if(hasta)params=params.set('hasta',hasta);return this.http.get<ReporteEspecie[]>(`${environment.apiUrl}/reportes/atenciones-por-especie`,{params});}
}
