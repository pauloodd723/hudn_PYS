import { AREAS_PS } from '../../constants';
import { fmtDate, getProgressPS } from '../../utils/helpers';
import { Icon, ProgressBar, Badge } from '../../components/ui';
import { printPS } from '../../print';

function ModalDetallePS({ ps, onClose, onArchive, onUnarchive, t }) {
  if(!ps) return null;
  const vals=AREAS_PS.map(a=>{const v=ps.validaciones.find(v=>v.areaId===a.id);return{...a,estado:v?.estado||"PENDIENTE",fecha:v?.fecha||null};});
  const {done,total,pct}=getProgressPS(ps.validaciones);
  const fase=pct<78?"Fase 1":pct<100?"Fase 2":"✓ Completo";
  const B=(ex={})=>({background:"transparent",border:`1px solid ${t.border}`,borderRadius:8,padding:"7px 12px",fontSize:12,fontWeight:600,cursor:"pointer",color:t.textMid,display:"flex",alignItems:"center",gap:5,...ex});
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",backdropFilter:"blur(5px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}}>
      <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:18,padding:"28px 30px",maxWidth:780,width:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:t.shadowMd}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18,flexWrap:"wrap",gap:10}}>
          <div><h2 style={{fontSize:17,fontWeight:800,color:t.text,marginBottom:2}}>{ps.nombre}</h2><p style={{fontSize:11,color:t.textMuted}}>ID: {ps.identificacion} · {ps.cargo}</p></div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
            {ps.archivado?<button onClick={()=>{onUnarchive(ps.id);onClose();}} style={B({background:"rgba(234,179,8,0.1)",border:"1px solid rgba(234,179,8,0.3)",color:"#ca8a04"})}><Icon name="upload" size={13}/>Desarchivar</button>
            :<button onClick={()=>{onArchive(ps.id);onClose();}} style={B({color:"#64748b"})}><Icon name="archive" size={13}/>Archivar</button>}
            <button onClick={()=>printPS(ps)} style={B({color:t.accent})}><Icon name="print" size={13}/>Imprimir</button>
            <button onClick={onClose} style={B({padding:"7px 9px"})}><Icon name="x" size={13}/></button>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:7,marginBottom:16}}>
          {[{l:"Dependencia",v:ps.dependencia},{l:"Coordinador",v:ps.coordinador},{l:"Fecha Retiro",v:fmtDate(ps.fechaRetiro)}].map(i=>(
            <div key={i.l} style={{background:t.surface2,border:`1px solid ${t.border}`,borderRadius:7,padding:"8px 11px"}}>
              <div style={{fontSize:9,color:t.textMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:0.6,marginBottom:3}}>{i.l}</div>
              <div style={{fontSize:12,fontWeight:600,color:t.text}}>{i.v}</div>
            </div>
          ))}
        </div>
        <div style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <span style={{fontSize:10,fontWeight:700,color:t.accent}}>PROGRESO — {fase}</span>
            <span style={{fontSize:10,color:t.textMuted}}>{done}/{total} · {pct}%</span>
          </div>
          <ProgressBar pct={pct} t={t}/>
        </div>
        <div style={{fontSize:10,fontWeight:700,color:t.textMuted,letterSpacing:0.9,textTransform:"uppercase",marginBottom:8}}>Estado por Área</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:5,maxHeight:260,overflowY:"auto"}}>
          {vals.map(v=>(
            <div key={v.id} style={{display:"flex",alignItems:"center",gap:7,padding:"6px 10px",borderRadius:7,background:v.estado==="VALIDADO"?"rgba(22,163,74,0.08)":"rgba(217,119,6,0.08)",border:`1px solid ${v.estado==="VALIDADO"?"rgba(22,163,74,0.3)":"rgba(217,119,6,0.3)"}`}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:v.estado==="VALIDADO"?"#22c55e":"#f59e0b",flexShrink:0}}/>
              <div style={{flex:1,overflow:"hidden"}}>
                <div style={{fontSize:10,color:v.estado==="VALIDADO"?"#16a34a":"#d97706",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v.nombre}</div>
                <div style={{fontSize:9,color:t.textMuted,marginTop:1}}>{v.fecha?fmtDate(v.fecha):"Pendiente"}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export { ModalDetallePS };
