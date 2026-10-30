import {Component,computed,inject,OnInit,signal} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {FormControl,ReactiveFormsModule} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';
import {PrestacionService} from '../../services/prestacion-service';
import {Prestacion} from '../../models/prestacion.model';
import {AuthService} from '../../../../core/auth/auth-service';
import {SiPermiso} from '../../../../shared/directives/si-permiso';
import {coincide} from '../../../../core/utils/texto';
import {mensajeError} from '../../../../core/utils/http-error';
@Component({selector:'app-prestacion-list',imports:[ReactiveFormsModule,RouterLink,CurrencyPipe,SiPermiso],templateUrl:'./prestacion-list.html'})
export class PrestacionList implements OnInit {
 protected service=inject(PrestacionService);protected auth=inject(AuthService);
 protected datos=signal<Prestacion[]>([]);protected cargando=signal(true);protected error=signal('');protected aviso=signal('');
 protected filtro=new FormControl('',{nonNullable:true});protected texto=toSignal(this.filtro.valueChanges,{initialValue:''});
 protected filtradas=computed(()=>this.datos().filter(p=>coincide(this.texto(),p.codigo,p.nombre,p.especieAplicable)));
 ngOnInit(){this.cargar();}
 cargar(){this.cargando.set(true);this.error.set('');this.service.listar().subscribe({next:d=>{this.datos.set(d);this.cargando.set(false);},error:e=>{this.error.set(mensajeError(e));this.cargando.set(false);}});}
 darDeBaja(p:Prestacion){if(!confirm(`¿Dar de baja la prestación ${p.codigo}?`))return;
  this.service.cambiarEstado(p.id,false).subscribe({next:()=>{this.aviso.set('Prestación dada de baja.');this.cargar();},error:e=>this.error.set(mensajeError(e))});}
 activar(p:Prestacion){if(!confirm(`¿Reactivar la prestación ${p.codigo}?`))return;this.service.cambiarEstado(p.id,true).subscribe({next:()=>{this.aviso.set('Prestación activada.');this.cargar();},error:e=>this.error.set(mensajeError(e))});}
 eliminar(p:Prestacion){if(!confirm('¿Eliminar físicamente? Si ya fue utilizada, la API responderá 409.'))return;
 this.service.eliminar(p.id).subscribe({next:()=>{this.aviso.set('Prestación eliminada.');this.cargar();},error:e=>this.error.set(mensajeError(e))});}
}
