import { Routes } from '@angular/router';
import { permisoGuard } from '../../core/guards/permiso-guard';
export const MASCOTAS_ROUTES: Routes = [
 {path:'',title:'Mascotas',loadComponent:()=>import('./pages/mascota-list/mascota-list').then(m=>m.MascotaList)},
 {path:'nuevo',canActivate:[permisoGuard],data:{permiso:'MASCOTA_ESCRIBIR'},title:'Nueva mascota',loadComponent:()=>import('./pages/mascota-form/mascota-form').then(m=>m.MascotaForm)},
 {path:':id/editar',canActivate:[permisoGuard],data:{permiso:'MASCOTA_ESCRIBIR'},title:'Editar mascota',loadComponent:()=>import('./pages/mascota-form/mascota-form').then(m=>m.MascotaForm)}
];
