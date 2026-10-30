import {Component,inject,OnInit,signal} from '@angular/core';
import {CurrencyPipe,DatePipe} from '@angular/common';
import {NonNullableFormBuilder,ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {AtencionService} from '../../services/atencion-service';
import {Atencion} from '../../models/atencion.model';
import {SiPermiso} from '../../../../shared/directives/si-permiso';
import {mensajeError} from '../../../../core/utils/http-error';
@Component({selector:'app-atencion-list',imports:[ReactiveFormsModule,RouterLink,CurrencyPipe,DatePipe,SiPermiso],templateUrl:'./atencion-list.html'})
export class AtencionList implements OnInit {
 private fb=inject(NonNullableFormBuilder);private service=inject(AtencionService);
 protected datos=signal<Atencion[]>([]);protected cargando=signal(true);protected error=signal('');
 protected filtros=this.fb.group({mascota:[''],especie:[''],estado:[''],desde:[''],hasta:['']});
 ngOnInit(){this.cargar();}
 cargar(){this.cargando.set(true);this.error.set('');this.service.listar(this.filtros.getRawValue()).subscribe({next:a=>{this.datos.set(a);this.cargando.set(false);},error:e=>{this.error.set(mensajeError(e));this.cargando.set(false);}})}
 limpiar(){this.filtros.reset();this.cargar();}
}
