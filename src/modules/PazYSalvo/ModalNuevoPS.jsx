import { useState, useCallback } from 'react';
import { CARGOS, DEPENDENCIAS_BASE, AREAS_PS } from '../../constants';
import { Icon, makeInpStyle, makeSelStyle, LBL } from '../../components/ui';
import { ModalConfirmacion } from '../../components/shared';

function ModalNuevoPS({ onClose, onSubmit, t }) {
  const [f,setF]=useState({identificacion:"",nombre:"",cargo:"",dependencia:"",dependenciaOtra:"",coordinador:"",fechaRetiro:""});
  const [showConfirm,setShowConfirm]=useState(false);
  const hc=e=>setF(p=>({...p,[e.target.name]:e.target.value}));
  const inp=makeInpStyle(t); const sel=makeSelStyle(t);

  const trySubmit=()=>{
    const dep=f.dependencia==="OTRA"?f.dependenciaOtra.trim():f.dependencia;
    if(!f.identificacion||!f.nombre||!f.cargo||!dep||!f.coordinador||!f.fechaRetiro){alert("Complete todos los campos obligatorios.");return;}
    setShowConfirm(true);
  };
  const confirmSubmit=()=>{
    const dep=f.dependencia==="OTRA"?f.dependenciaOtra.trim():f.dependencia;
    onSubmit({...f,dependencia:dep}); setShowConfirm(false);
  };

  return (
    <>
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}}>
      <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:18,padding:"28px 30px",maxWidth:640,width:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:t.shadowMd}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div><h2 style={{fontSize:18,fontWeight:800,color:t.text}}>Nuevo Paz y Salvo</h2><p style={{fontSize:12,color:t.textMuted}}>Datos del funcionario que se retira</p></div>
          <button onClick={onClose} style={{background:"transparent",border:`1px solid ${t.border}`,borderRadius:7,padding:"5px 9px",cursor:"pointer",color:t.textMid,display:"flex"}}><Icon name="x" size={14}/></button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:13,marginBottom:13}}>
          <div>{LBL(t,"Identificación",true)}<input name="identificacion" value={f.identificacion} onChange={hc} style={inp}/></div>
          <div>{LBL(t,"Nombres y Apellidos",true)}<input name="nombre" value={f.nombre} onChange={hc} style={inp}/></div>
          <div>{LBL(t,"Cargo",true)}<select name="cargo" value={f.cargo} onChange={hc} style={sel}><option value="">Seleccionar...</option>{CARGOS.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
          <div>{LBL(t,"Dependencia",true)}<select name="dependencia" value={f.dependencia} onChange={hc} style={sel}><option value="">Seleccionar...</option>{DEPENDENCIAS_BASE.map(d=><option key={d} value={d}>{d}</option>)}<option value="OTRA">— Otra —</option></select></div>
          {f.dependencia==="OTRA"&&<div style={{gridColumn:"1/-1"}}>{LBL(t,"Especificar dependencia",true)}<input name="dependenciaOtra" value={f.dependenciaOtra} onChange={hc} style={inp}/></div>}
          <div>{LBL(t,"Coordinador / Área",true)}<select name="coordinador" value={f.coordinador} onChange={hc} style={sel}><option value="">Seleccionar...</option>{AREAS_PS.map(a=><option key={a.id} value={a.responsable}>{a.responsable} — {a.nombre}</option>)}</select></div>
          <div>{LBL(t,"Fecha de Retiro",true)}<input name="fechaRetiro" type="date" value={f.fechaRetiro} onChange={hc} style={inp}/></div>
        </div>
        <div style={{background:t.surface2,border:`1px solid ${t.border}`,borderRadius:8,padding:"11px 14px",marginBottom:18,fontSize:11,color:t.textMuted,lineHeight:1.7}}>
          📧 Se notificará a las <strong style={{color:t.text}}>14 áreas</strong> simultáneamente. Cadena: Tesorería → Administrativo & Prestación → Gerencia. Recordatorio cada <strong style={{color:t.text}}>48h</strong>.
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{background:"transparent",border:`1px solid ${t.border}`,borderRadius:8,padding:"9px 18px",fontSize:13,fontWeight:600,cursor:"pointer",color:t.textMid,display:"flex",alignItems:"center",gap:6}}><Icon name="x" size={13}/>Cancelar</button>
          <button onClick={trySubmit} style={{background:"linear-gradient(135deg,#0284c7,#0369a1)",color:"white",border:"none",borderRadius:8,padding:"9px 20px",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}><Icon name="send" size={13}/>Enviar</button>
        </div>
      </div>
    </div>
    {showConfirm&&<ModalConfirmacion
      titulo="¿Confirmar envío?"
      mensaje={`Se enviará el Paz y Salvo de "${f.nombre}" a las 14 áreas simultáneamente. Esta acción no se puede deshacer.`}
      onConfirm={confirmSubmit}
      onCancel={()=>setShowConfirm(false)}
      t={t}
    />}
    </>
  );
}


export { ModalNuevoPS };
