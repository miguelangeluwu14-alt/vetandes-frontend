import {Injectable,inject} from '@angular/core';
import {HttpClient,HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Atencion,AtencionRequest,AtencionFiltros} from '../models/atencion.model';
@Injectable({providedIn:'root'})
export class AtencionService {
 private http=inject(HttpClient); private url=`${environment.apiUrl}/atenciones`;
 listar(f:AtencionFiltros={}){let params=new HttpParams();for(const [key,value] of Object.entries(f))if(value!=null&&value!=='')params=params.set(key,value);return this.http.get<Atencion[]>(this.url,{params});}
 obtener(id:number){return this.http.get<Atencion>(`${this.url}/${id}`);}
 registrar(dto:AtencionRequest){return this.http.post<Atencion>(this.url,dto);}
 anular(id:number,motivo:string){return this.http.patch<Atencion>(`${this.url}/${id}/anular`,{motivo});}
}
