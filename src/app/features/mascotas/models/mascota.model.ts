export type Especie = 'PERRO'|'GATO'|'OTRO';
export interface Mascota {id:number;nombre:string;especie:Especie;raza:string|null;fechaNacimiento:string;sexo:'M'|'H';propietarioId:number;propietarioNombre:string}
export type MascotaRequest=Pick<Mascota,'nombre'|'especie'|'raza'|'fechaNacimiento'|'sexo'|'propietarioId'>;
export interface Propietario {id:number;dni:string;nombres:string;telefono:string|null}
