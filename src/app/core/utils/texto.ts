export function coincide(texto:string,...partes:(string|null|undefined)[]):boolean {
 const normalizar=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const q=normalizar(texto.trim());return partes.some(p=>normalizar(p??'').includes(q));
}
