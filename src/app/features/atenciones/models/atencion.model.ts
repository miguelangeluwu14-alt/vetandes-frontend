export interface DetalleAtencionRequest {prestacionId:number;cantidad:number}
export interface AtencionRequest {mascotaId:number;peso:number;diagnostico:string;detalles:DetalleAtencionRequest[]}
export interface DetalleAtencion {prestacionId:number;prestacionNombre:string;cantidad:number;precioUnitario:number;subtotal:number}
export interface Atencion {id:number;numero:string;fecha:string;mascotaId:number;mascotaNombre:string;especie:string;peso:number;diagnostico:string;estado:'REGISTRADA'|'ANULADA';subtotal:number;descuento:number;total:number;usuarioRegistro:string;motivoAnulacion:string|null;detalles:DetalleAtencion[]}
export interface AtencionFiltros {mascota?:string;especie?:string;estado?:string;desde?:string;hasta?:string}
