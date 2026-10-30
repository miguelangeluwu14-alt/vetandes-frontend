import {Component,inject,OnInit,signal,computed} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {ReactiveFormsModule,NonNullableFormBuilder} from '@angular/forms';
import {ReporteService} from '../../services/reporte-service';
import {ReporteEspecie} from '../../models/reporte.model';
import {mensajeError} from '../../../../core/utils/http-error';
@Component({selector:'app-reporte',imports:[CurrencyPipe,ReactiveFormsModule],templateUrl:'./reporte.html'})
export class Reporte implements OnInit {
 private fb=inject(NonNullableFormBuilder);private service=inject(ReporteService);
 protected filtros=this.fb.group({desde:[''],hasta:['']});protected cargando=signal(true);protected error=signal('');protected datos=signal<ReporteEspecie[]>([]);
 protected importe=computed(()=>this.datos().reduce((s,x)=>s+x.importeTotal,0));protected cantidad=computed(()=>this.datos().reduce((s,x)=>s+x.cantidadAtenciones,0));
 ngOnInit(){this.cargar();}
 cargar(){const f=this.filtros.getRawValue();if(f.desde&&f.hasta&&f.desde>f.hasta){this.error.set('La fecha desde no puede ser posterior a hasta.');return;}
 this.cargando.set(true);this.error.set('');this.service.porEspecie(f.desde,f.hasta).subscribe({next:d=>{this.datos.set(d);this.cargando.set(false)},error:e=>{this.error.set(mensajeError(e));this.cargando.set(false)}})}
}
