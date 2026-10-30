import { Injectable,inject } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Prestacion,PrestacionRequest } from '../models/prestacion.model';
@Injectable({providedIn:'root'})
export class PrestacionService {
 private http=inject(HttpClient); private url=`${environment.apiUrl}/prestaciones`;
 listar(especie?:string){let p=new HttpParams();if(especie)p=p.set('especie',especie);return this.http.get<Prestacion[]>(this.url,{params:p});}
 obtener(id:number){return this.http.get<Prestacion>(`${this.url}/${id}`);}
 crear(dto:PrestacionRequest){return this.http.post<Prestacion>(this.url,dto);}
 actualizar(id:number,dto:PrestacionRequest){return this.http.put<Prestacion>(`${this.url}/${id}`,dto);}
 cambiarEstado(id:number,activo:boolean){return this.http.patch<Prestacion>(`${this.url}/${id}/estado`,{activo});}
 eliminar(id:number){return this.http.delete<void>(`${this.url}/${id}`);}
}
