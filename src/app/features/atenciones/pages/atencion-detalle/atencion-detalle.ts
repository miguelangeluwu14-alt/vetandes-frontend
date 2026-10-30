import {Component,inject,OnInit,signal} from '@angular/core';
import {CurrencyPipe,DatePipe} from '@angular/common';
import {ActivatedRoute,RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {AtencionService} from '../../services/atencion-service';
import {Atencion} from '../../models/atencion.model';
import {AuthService} from '../../../../core/auth/auth-service';
import {mensajeError} from '../../../../core/utils/http-error';
@Component({selector:'app-atencion-detalle',imports:[CurrencyPipe,DatePipe,RouterLink,FormsModule],templateUrl:'./atencion-detalle.html'})
export class AtencionDetalle implements OnInit {
 private service=inject(AtencionService);private route=inject(ActivatedRoute);protected auth=inject(AuthService);
 protected id=Number(this.route.snapshot.paramMap.get('id'));protected registrada=this.route.snapshot.queryParamMap.get('registrada');
 protected atencion=signal<Atencion|null>(null);protected cargando=signal(true);protected guardando=signal(false);protected error=signal('');protected aviso=signal('');
 protected motivo='';protected formularioAnulacion=signal(false);
 ngOnInit(){this.cargar()}
 cargar(){this.cargando.set(true);this.service.obtener(this.id).subscribe({next:a=>{this.atencion.set(a);this.cargando.set(false)},error:e=>{this.error.set(mensajeError(e));this.cargando.set(false)}})}
 anular(){if(this.motivo.trim().length<10||this.motivo.trim().length>200){this.error.set('El motivo debe tener entre 10 y 200 caracteres.');return;}
 if(!confirm('¿Confirmas la anulación de esta atención?'))return;
 this.guardando.set(true);this.error.set('');this.service.anular(this.id,this.motivo.trim()).subscribe({next:a=>{this.atencion.set(a);this.aviso.set('Atención anulada correctamente.');this.formularioAnulacion.set(false);this.guardando.set(false)},error:e=>{this.error.set(mensajeError(e));this.guardando.set(false)}})}
}
