import {Component,computed,inject,OnInit,signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {toSignal} from '@angular/core/rxjs-interop';
import {FormControl,ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {MascotaService} from '../../services/mascota-service';
import {Mascota,Propietario} from '../../models/mascota.model';
import {AuthService} from '../../../../core/auth/auth-service';
import {SiPermiso} from '../../../../shared/directives/si-permiso';
import {coincide} from '../../../../core/utils/texto';
import {mensajeError} from '../../../../core/utils/http-error';
@Component({selector:'app-mascota-list',imports:[ReactiveFormsModule,RouterLink,SiPermiso],templateUrl:'./mascota-list.html'})
export class MascotaList implements OnInit {
 protected service=inject(MascotaService);protected auth=inject(AuthService);
 protected datos=signal<Mascota[]>([]);protected propietarios=signal<Propietario[]>([]);protected cargando=signal(true);protected error=signal('');protected aviso=signal('');
 protected filtro=new FormControl('',{nonNullable:true});protected propietarioId=new FormControl<number|null>(null);
 private texto=toSignal(this.filtro.valueChanges,{initialValue:''});
 protected filtradas=computed(()=>this.datos().filter(p=>coincide(this.texto(),p.nombre,p.especie,p.raza,p.propietarioNombre)));
 ngOnInit(){this.service.propietarios().subscribe({next:p=>this.propietarios.set(p),error:e=>this.error.set(mensajeError(e))});this.cargar();}
 cargar(){this.cargando.set(true);this.error.set('');this.service.listar(this.propietarioId.value).subscribe({next:d=>{this.datos.set(d);this.cargando.set(false);},error:e=>{this.error.set(mensajeError(e));this.cargando.set(false)}});}
 edad(nacimiento:string){const hoy=new Date();const d=new Date(`${nacimiento}T12:00:00`);let edad=hoy.getFullYear()-d.getFullYear();if(hoy.getMonth()<d.getMonth() ||(hoy.getMonth()===d.getMonth() && hoy.getDate()<d.getDate()))edad--;return Math.max(0,edad);}
 eliminar(m:Mascota){if(!confirm(`¿Eliminar a ${m.nombre}? Si tiene atenciones, el servidor lo impedirá.`))return;this.service.eliminar(m.id).subscribe({next:()=>{this.aviso.set('Mascota eliminada.');this.cargar();},error:e=>this.error.set(mensajeError(e))});}
}
