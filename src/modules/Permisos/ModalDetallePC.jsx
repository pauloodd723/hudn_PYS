import { FIRMANTES_PC } from '../../constants';
import { fmtDate, getProgressPC } from '../../utils/helpers';
import { Icon, ProgressBar, Badge } from '../../components/ui';
import { printPC } from '../../print';

function ModalDetallePC({ pc, onClose, onArchive, onUnarchive, t }) {
  if(!pc) return null;
  const firmas=FIRMANTES_PC.map(f=>{const firma=pc.firmas.find(x=>x.firmanteId===f.id);return{...f,estado:firma?.estado||"PENDIENTE",fecha:firma?.fecha||null,fotoUrl:firma?.fotoUrl||null};});
  const {done,total,pct}=getProgressPC(pc.firmas);
  const B=(ex={})=>({background:"transparent",border:`1px solid ${t.border}`,borderRadius:8,padding:"7px 12px",fontSize:12,fontWeight:600,cursor:"pointer",color:t.textMid,display:"flex",alignItems:"center",gap:5,...ex});
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",backdropFilter:"blur(5px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}}>
      <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:18,padding:"28px 30px",maxWidth:800,width:"100%",maxHeight:"92vh",overflowY:"auto",boxShadow:t.shadowMd}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18,flexWrap:"wrap",gap:10}}>
          <div><h2 style={{fontSize:17,fontWeight:800,color:t.text,marginBottom:2}}>{pc.nombre}</h2><p style={{fontSize:11,color:t.textMuted}}>ID: {pc.identificacion} · {pc.cargo} · {pc.tipoVinculacion}</p></div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
            {pc.archivado?<button onClick={()=>{onUnarchive(pc.id);onClose();}} style={B({background:"rgba(234,179,8,0.1)",border:"1px solid rgba(234,179,8,0.3)",color:"#ca8a04"})}><Icon name="upload" size={13}/>Desarchivar</button>
            :<button onClick={()=>{onArchive(pc.id);onClose();}} style={B({color:"#64748b"})}><Icon name="archive" size={13}/>Archivar</button>}
            <button onClick={()=>printPC(pc)} style={B({color:"#7c3aed"})}><Icon name="print" size={13}/>Imprimir</button>
            <button onClick={onClose} style={B({padding:"7px 9px"})}><Icon name="x" size={13}/></button>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:7,marginBottom:16}}>
          {[{l:"Área de Servicios",v:pc.areaServicios},{l:"Período Inicio",v:fmtDate(pc.fechaInicio)},{l:"Período Fin",v:pc.fechaFin?fmtDate(pc.fechaFin):"Indefinido"}].map(i=>(
            <div key={i.l} style={{background:t.surface2,border:`1px solid ${t.border}`,borderRadius:7,padding:"8px 11px"}}>
              <div style={{fontSize:9,color:t.textMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:0.6,marginBottom:3}}>{i.l}</div>
              <div style={{fontSize:12,fontWeight:600,color:t.text}}>{i.v}</div>
            </div>
          ))}
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:10,fontWeight:700,color:t.textMuted,letterSpacing:0.9,textTransform:"uppercase",marginBottom:8}}>Permisos Solicitados</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {pc.permisos.map(p=><span key={p} style={{background:"rgba(124,58,237,0.08)",border:"1px solid rgba(124,58,237,0.3)",color:"#7c3aed",padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:700}}>✓ {p}</span>)}
          </div>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <span style={{fontSize:10,fontWeight:700,color:"#7c3aed"}}>PROGRESO DE FIRMAS</span>
            <span style={{fontSize:10,color:t.textMuted}}>{done}/{total} · {pct}%</span>
          </div>
          <ProgressBar pct={pct} t={t} color={pct===100?"linear-gradient(90deg,#22c55e,#16a34a)":"linear-gradient(90deg,#7c3aed,#a78bfa)"}/>
        </div>
        <div style={{fontSize:10,fontWeight:700,color:t.textMuted,letterSpacing:0.9,textTransform:"uppercase",marginBottom:10}}>Estado de Firmas</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {firmas.map((f,i)=>(
            <div key={f.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:10,background:f.estado==="FIRMADO"?"rgba(22,163,74,0.08)":"rgba(217,119,6,0.06)",border:`1px solid ${f.estado==="FIRMADO"?"rgba(22,163,74,0.3)":"rgba(217,119,6,0.25)"}`}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:f.estado==="FIRMADO"?"#16a34a":"#d97706",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:11,fontWeight:800,flexShrink:0}}>{i+1}</div>
              {f.fotoUrl&&<img src={f.fotoUrl} alt="foto" style={{width:36,height:36,borderRadius:"50%",objectFit:"cover",border:`2px solid ${t.border}`,flexShrink:0}}/>}
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:700,color:t.text}}>{f.rol}</div>
                <div style={{fontSize:10,color:t.textMuted,marginTop:1}}>{f.requiereFoto?"Requiere foto y aceptación de T&C":""}{f.fecha?` · Firmado: ${fmtDate(f.fecha)}`:""}</div>
              </div>
              <Badge estado={f.estado}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export { ModalDetallePC };
