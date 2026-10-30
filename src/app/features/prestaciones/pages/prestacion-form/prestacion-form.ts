import {Component,inject,OnInit,signal} from '@angular/core';
import {ReactiveFormsModule,NonNullableFormBuilder,Validators} from '@angular/forms';
import {Router,ActivatedRoute,RouterLink} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {PrestacionService} from '../../services/prestacion-service';
import {EspecieAplicable,PrestacionRequest} from '../../models/prestacion.model';
import {mensajeError,erroresDeValidacion} from '../../../../core/utils/http-error';
@Component({selector:'app-prestacion-form',imports:[ReactiveFormsModule,RouterLink],templateUrl:'./prestacion-form.html'})
export class PrestacionForm implements OnInit {
 private fb=inject(NonNullableFormBuilder);private service=inject(PrestacionService);private route=inject(ActivatedRoute);private router=inject(Router);
 protected id=Number(this.route.snapshot.paramMap.get('id'))||null;
 protected guardando=signal(false);protected cargando=signal(!!this.id);protected error=signal('');protected campos=signal<Record<string,string>>({});
 protected form=this.fb.group({
 codigo:['',[Validators.required,Validators.pattern(/^PRS-\d{3}$/)]],
 nombre:['',[Validators.required,Validators.minLength(3),Validators.maxLength(80)]],
 precio:[0,[Validators.required,Validators.min(0.01)]],
 especieAplicable:['TODAS' as EspecieAplicable,Validators.required],
 activo:[true]
 });
 ngOnInit(){if(this.id)this.service.obtener(this.id).subscribe({next:p=>{this.form.setValue({codigo:p.codigo,nombre:p.nombre,precio:p.precio,especieAplicable:p.especieAplicable,activo:p.activo});this.cargando.set(false)},error:e=>{this.error.set(mensajeError(e));this.cargando.set(false);}});}
 mensaje(campo:string){return this.campos()[campo];}
 guardar(){if(this.form.invalid){this.form.markAllAsTouched();return;}this.guardando.set(true);this.error.set('');this.campos.set({});
 const dto=this.form.getRawValue() as PrestacionRequest;
 const req=this.id?this.service.actualizar(this.id,dto):this.service.crear(dto);
 req.subscribe({next:()=>this.router.navigateByUrl('/prestaciones'),error:(e:HttpErrorResponse)=>{this.guardando.set(false);this.error.set(mensajeError(e));this.campos.set(erroresDeValidacion(e));}});
 }
}
