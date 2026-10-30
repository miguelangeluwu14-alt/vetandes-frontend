export type EspecieAplicable = 'PERRO' | 'GATO' | 'TODAS';
export interface Prestacion {id:number;codigo:string;nombre:string;precio:number;especieAplicable:EspecieAplicable;activo:boolean}
export type PrestacionRequest = Omit<Prestacion,'id'>;
