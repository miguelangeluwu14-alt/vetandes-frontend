import {Component,computed,inject,OnInit,signal} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {FormControl,FormGroup,NonNullableFormBuilder,ReactiveFormsModule,Validators} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
import {Router,RouterLink} from '@angular/router';
import {forkJoin} from 'rxjs';
import {MascotaService} from '../../../mascotas/services/mascota-service';
import {Mascota} from '../../../mascotas/models/mascota.model';
import {PrestacionService} from '../../../prestaciones/services/prestacion-service';
import {Prestacion} from '../../../prestaciones/models/prestacion.model';
import {AtencionService} from '../../services/atencion-service';
import {AtencionRequest} from '../../models/atencion.model';
import {mensajeError} from '../../../../core/utils/http-error';
import {coincide} from '../../../../core/utils/texto';
interface LineaForm {prestacionId:FormControl<number>;cantidad:FormControl<number>}
@Component({selector:'app-atencion-form',imports:[ReactiveFormsModule,RouterLink,CurrencyPipe],templateUrl:'./atencion-form.html'})
export class AtencionForm implements OnInit {
 private fb=inject(NonNullableFormBuilder);private mascotasService=inject(MascotaService);private prestacionesService=inject(PrestacionService);
 private service=inject(AtencionService);private router=inject(Router);
 protected mascotas=signal<Mascota[]>([]);protected prestaciones=signal<Prestacion[]>([]);protected cargando=signal(true);
 protected enviando=signal(false);protected confirmando=signal(false);protected error=signal('');
 protected buscarMascota=new FormControl('',{nonNullable:true});protected buscarPrestacion=new FormControl('',{nonNullable:true});
 protected form=this.fb.group({mascotaId:this.fb.control<number|null>(null,Validators.required),peso:[0,[Validators.required,Validators.min(0.01)]],diagnostico:['',[Validators.maxLength(300)]],detalles:this.fb.array<FormGroup<LineaForm>>([],Validators.required)});
 get detalles(){return this.form.controls.detalles;}
 private textoMascota=toSignal(this.buscarMascota.valueChanges,{initialValue:''});
 private textoPrestacion=toSignal(this.buscarPrestacion.valueChanges,{initialValue:''});
 private mascotaId=toSignal(this.form.controls.mascotaId.valueChanges,{initialValue:null as number|null});
 private valores=toSignal(this.form.valueChanges,{initialValue:this.form.value});
 protected mascotaElegida=computed(()=>this.mascotas().find(x=>x.id===this.mascotaId())??null);
 protected mascotasEncontradas=computed(()=>{const t=this.textoMascota().trim();return t?this.mascotas().filter(m=>coincide(t,m.nombre,m.propietarioNombre,m.especie)).slice(0,8):[]});
 protected opciones=computed(()=>{const e=this.mascotaElegida()?.especie;const q=this.textoPrestacion().trim();if(!e||!q)return [];
 return this.prestaciones().filter(p=>p.activo&&(p.especieAplicable==='TODAS'||p.especieAplicable===e)&&coincide(q,p.codigo,p.nombre)).slice(0,8);});
 protected resumen=computed(()=>{const valores=this.valores().detalles??[];return valores.map(l=>{const p=this.prestaciones().find(x=>x.id===l?.prestacionId);const cantidad=Number(l?.cantidad??0);const precio=p?.precio??0;return {p,cantidad,precio,subtotal:Math.round((precio*cantidad+Number.EPSILON)*100)/100};});});
 protected subtotal=computed(()=>this.redondear(this.resumen().reduce((s,l)=>s+l.subtotal,0)));
 protected descuento=computed(()=>this.resumen().length>=3?this.redondear(this.subtotal()*0.10):0);
 protected total=computed(()=>this.redondear(this.subtotal()-this.descuento()));
 protected advertencia=computed(()=>{const r=this.resumen();if(r.length<1||r.length>8)return 'La atención debe tener entre 1 y 8 prestaciones distintas.';
 if(r.some(l=>!l.p||!Number.isInteger(l.cantidad)||l.cantidad<1||l.cantidad>3))return 'Cada cantidad debe ser un número entero entre 1 y 3.';
 if(r.some(l=>!l.p!.activo||!(l.p!.especieAplicable==='TODAS'||l.p!.especieAplicable===this.mascotaElegida()?.especie)))return 'Hay prestaciones incompatibles con la especie.';
 return '';});
 private redondear(n:number){return Math.round((n+Number.EPSILON)*100)/100;}
 ngOnInit(){forkJoin({mascotas:this.mascotasService.listar(),prestaciones:this.prestacionesService.listar()}).subscribe({next:({mascotas,prestaciones})=>{this.mascotas.set(mascotas);this.prestaciones.set(prestaciones);this.cargando.set(false)},error:e=>{this.error.set(mensajeError(e));this.cargando.set(false)}});}
 elegirMascota(m:Mascota){if(this.form.controls.mascotaId.value!==m.id)this.detalles.clear();this.form.controls.mascotaId.setValue(m.id);this.buscarMascota.setValue('');this.confirmando.set(false);}
 cambiarMascota(){this.form.controls.mascotaId.setValue(null);this.detalles.clear();this.confirmando.set(false);}
 agregar(p:Prestacion){if(this.detalles.length>=8){this.error.set('Máximo 8 prestaciones diferentes.');return;}
 if(this.detalles.controls.some(c=>c.controls.prestacionId.value===p.id)){this.error.set('La prestación ya está agregada. Cambia la cantidad en su fila.');return;}
 this.detalles.push(this.fb.group({prestacionId:this.fb.control(p.id),cantidad:this.fb.control(1,[Validators.required,Validators.min(1),Validators.max(3),Validators.pattern(/^\d+$/)])}));this.buscarPrestacion.setValue('');this.error.set('');this.confirmando.set(false);}
 quitar(i:number){this.detalles.removeAt(i);this.confirmando.set(false);}
 revisar(){if(this.form.invalid||this.advertencia()){this.form.markAllAsTouched();this.error.set(this.advertencia()||'Revise los campos obligatorios.');return;}this.error.set('');this.confirmando.set(true);}
 registrar(){if(this.enviando()||this.form.invalid||this.advertencia())return;
 const v=this.form.getRawValue();const dto:AtencionRequest={mascotaId:v.mascotaId!,peso:v.peso,diagnostico:v.diagnostico,detalles:v.detalles.map(d=>({prestacionId:d.prestacionId,cantidad:d.cantidad}))};
 this.enviando.set(true);this.error.set('');this.service.registrar(dto).subscribe({next:r=>this.router.navigate(['/atenciones',r.id],{queryParams:{registrada:r.numero}}),error:e=>{this.enviando.set(false);this.confirmando.set(false);this.error.set(mensajeError(e));}});
 }
}
