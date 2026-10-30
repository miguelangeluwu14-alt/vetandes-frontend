import {Component,inject,OnInit,signal} from '@angular/core';
import {ReactiveFormsModule,NonNullableFormBuilder,Validators} from '@angular/forms';
import {Router,ActivatedRoute,RouterLink} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {forkJoin} from 'rxjs';
import {MascotaService} from '../../services/mascota-service';
import {Especie,MascotaRequest,Propietario} from '../../models/mascota.model';
import {mensajeError,erroresDeValidacion} from '../../../../core/utils/http-error';
@Component({selector:'app-mascota-form',imports:[ReactiveFormsModule,RouterLink],templateUrl:'./mascota-form.html'})
export class MascotaForm implements OnInit {
 private fb=inject(NonNullableFormBuilder);private service=inject(MascotaService);private route=inject(ActivatedRoute);private router=inject(Router);
 protected id=Number(this.route.snapshot.paramMap.get('id'))||null;
 protected propietarios=signal<Propietario[]>([]);protected guardando=signal(false);protected cargando=signal(true);protected error=signal('');protected campos=signal<Record<string,string>>({});
 protected hoy=(()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;})();
 protected form=this.fb.group({nombre:['',[Validators.required,Validators.minLength(2),Validators.maxLength(40)]],especie:['PERRO' as Especie,Validators.required],raza:[''],fechaNacimiento:['',Validators.required],sexo:['M' as 'M'|'H',Validators.required],propietarioId:this.fb.control<number|null>(null,Validators.required)});
 ngOnInit(){if(this.id){forkJoin({propietarios:this.service.propietarios(),mascota:this.service.obtener(this.id)}).subscribe({next:({propietarios,mascota})=>{this.propietarios.set(propietarios);this.form.setValue({nombre:mascota.nombre,especie:mascota.especie,raza:mascota.raza??'',fechaNacimiento:mascota.fechaNacimiento,sexo:mascota.sexo,propietarioId:mascota.propietarioId});this.cargando.set(false)},error:e=>{this.error.set(mensajeError(e));this.cargando.set(false)}});}
 else this.service.propietarios().subscribe({next:p=>{this.propietarios.set(p);this.cargando.set(false)},error:e=>{this.error.set(mensajeError(e));this.cargando.set(false)}});}
 mensaje(c:string){return this.campos()[c];}
 guardar(){if(this.form.invalid){this.form.markAllAsTouched();return;}if(this.form.controls.fechaNacimiento.value>this.hoy){this.error.set('La fecha de nacimiento no puede ser futura.');return;}
 this.guardando.set(true);this.error.set('');this.campos.set({});const v=this.form.getRawValue();const dto={...v,propietarioId:v.propietarioId!,raza:v.raza||null} as MascotaRequest;
 const req=this.id?this.service.actualizar(this.id,dto):this.service.crear(dto);
 req.subscribe({next:()=>this.router.navigateByUrl('/mascotas'),error:(e:HttpErrorResponse)=>{this.guardando.set(false);this.error.set(mensajeError(e));this.campos.set(erroresDeValidacion(e));}});}
}
