import { Injectable,inject } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Mascota,MascotaRequest,Propietario } from '../models/mascota.model';
@Injectable({providedIn:'root'})
export class MascotaService {
 private http=inject(HttpClient); private url=`${environment.apiUrl}/mascotas`;
 listar(propietarioId?:number|null){let params=new HttpParams();if(propietarioId!=null)params=params.set('propietarioId',propietarioId);return this.http.get<Mascota[]>(this.url,{params});}
 propietarios(){return this.http.get<Propietario[]>(`${environment.apiUrl}/propietarios`);}
 obtener(id:number){return this.http.get<Mascota>(`${this.url}/${id}`);}
 crear(dto:MascotaRequest){return this.http.post<Mascota>(this.url,dto);}
 actualizar(id:number,dto:MascotaRequest){return this.http.put<Mascota>(`${this.url}/${id}`,dto);}
 eliminar(id:number){return this.http.delete<void>(`${this.url}/${id}`);}
}
