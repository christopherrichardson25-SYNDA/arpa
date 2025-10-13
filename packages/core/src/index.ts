
export type ScoreInput = { imp: number; sv?: number | null; sh: number; seg?: number | null; watch?: number | null; dur?: number | null; };
export function RS({imp, sv=null, sh, watch=null, dur=null}: ScoreInput){ const svp = imp>0 && sv!=null ? sv/imp : 0; const shp = imp>0 ? sh/imp : 0; const R = (dur && dur>0 && watch!=null) ? Math.min(watch/dur,1) : 1; return (svp + shp) * R; }
export function rho({imp, seg=null}: ScoreInput){ return imp>0 && seg!=null ? (seg/imp)*1000 : 0; }
export function etiqueta(rs:number, r:number){ return (rs>=0.01 && r>=3) ? "Armónico" : (rs>=0.004 ? "Metaestable" : "Entrópico") }
