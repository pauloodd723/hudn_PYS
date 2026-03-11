import { useState, useCallback } from 'react';
import { TIPOS_VINCULACION, PERMISOS_LISTA, ENTRENAMIENTO_OPTS } from '../../constants';
import { Icon, makeInpStyle, makeSelStyle, LBL } from '../../components/ui';
import { ModalConfirmacion } from '../../components/shared';
import { fmtDate } from '../../utils/helpers';

function ModalNuevoPC({ onClose, onSubmit, t }) {
  const emptyForm = {
    identificacion:"", nombre:"", lugarExpedicion:"", direccionResidencia:"",
    telCelular:"", correoPersonal:"", telFijo:"",
    tipoVinculacion:"", fechaInicio:"", fechaFin:"", areaServicios:"", cargo:"",
    numRegistro:"", empresaContratista:"", direccionContratista:"", telContratista:"",
    permisos:[],
    fechaDiligenciamiento:"", fechaEntrenamiento:"", horaInicio:"", horaFin:"",
    responsableEntrenamiento:"", entrenamientoEn:[],
    fechaRecepcionTH:""
  };
  const [f,setF]=useState(emptyForm);
  const [showConfirm,setShowConfirm]=useState(false);
  const hc=e=>setF(p=>({...p,[e.target.name]:e.target.value}));
  const togglePerm=p=>setF(prev=>({...prev,permisos:prev.permisos.includes(p)?prev.permisos.filter(x=>x!==p):[...prev.permisos,p]}));
  const toggleEnt=o=>setF(prev=>({...prev,entrenamientoEn:prev.entrenamientoEn.includes(o)?prev.entrenamientoEn.filter(x=>x!==o):[...prev.entrenamientoEn,o]}));
  const inp=makeInpStyle(t); const sel=makeSelStyle(t);

  const trySubmit=()=>{
    if(!f.identificacion||!f.nombre){alert("Identificación y Nombre son obligatorios.");return;}
    setShowConfirm(true);
  };

  const saveDraft=()=>{ onSubmit({...f, _borrador:true}); };

  const SEC = (label, color) => (
    <div style={{fontSize:10,fontWeight:800,color:color||t.accent,letterSpacing:1,textTransform:"uppercase",marginBottom:10,borderBottom:`2px solid ${color||t.accent}33`,paddingBottom:6,marginTop:4}}>{label}</div>
  );

  return (
    <>
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}}>
      <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:18,padding:"28px 30px",maxWidth:780,width:"100%",maxHeight:"94vh",overflowY:"auto",boxShadow:t.shadowMd}}>

        {/* Header oficial */}
        <div style={{border:`2px solid ${t.border}`,borderRadius:10,marginBottom:20,overflow:"hidden"}}>
          <div style={{display:"flex",alignItems:"stretch",background:t.surface2}}>
            <div style={{padding:"10px 14px",borderRight:`1px solid ${t.border}`,textAlign:"center",minWidth:100}}>
              <div style={{fontSize:9,fontWeight:800,color:t.textMid,lineHeight:1.4}}>HOSPITAL<br/>UNIVERSITARIO</div>
              <div style={{fontSize:7,color:t.textMuted,marginTop:2}}>DEPARTAMENTAL DE NARIÑO E.S.E.</div>
            </div>
            <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"8px 16px",borderRight:`1px solid ${t.border}`}}>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:13,fontWeight:800,color:t.text,letterSpacing:0.5}}>ASIGNACIÓN DE PERMISOS Y CLAVES</div>
              </div>
            </div>
            <div style={{padding:"6px 10px",fontSize:9,minWidth:160}}>
              {[["CÓDIGO","FRSGI-002"],["VERSIÓN","06"],["FECHA ELAB.","05 JUN 2014"],["ACTUALIZACIÓN","22 SEP 2023"],["HOJA","1 DE: 1"]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:2,gap:6}}><b style={{color:t.textMuted}}>{k}</b><span style={{color:t.text}}>{v}</span></div>
              ))}
            </div>
          </div>
        </div>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <p style={{fontSize:12,color:t.textMuted}}>Los campos marcados con <span style={{color:"#ef4444"}}>*</span> son obligatorios</p>
          <button onClick={onClose} style={{background:"transparent",border:`1px solid ${t.border}`,borderRadius:7,padding:"5px 9px",cursor:"pointer",color:t.textMid,display:"flex"}}><Icon name="x" size={14}/></button>
        </div>

        {/* Fecha diligenciamiento */}
        <div style={{marginBottom:16,display:"flex",alignItems:"center",gap:12,background:t.surface2,padding:"10px 14px",borderRadius:8,border:`1px solid ${t.border}`}}>
          <div style={{flex:1}}>{LBL(t,"Fecha Diligenciamiento (DD/MM/AAAA)")}<input name="fechaDiligenciamiento" type="date" value={f.fechaDiligenciamiento} onChange={hc} style={inp}/></div>
        </div>

        {/* 1. Datos Personales */}
        {SEC("1. Datos Personales","#7c3aed")}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:12,marginBottom:18}}>
          <div style={{gridColumn:"1/-1"}}>{LBL(t,"Nombres y Apellidos Completos",true)}<input name="nombre" value={f.nombre} onChange={hc} style={inp}/></div>
          <div>{LBL(t,"Número de Identificación",true)}<input name="identificacion" value={f.identificacion} onChange={hc} style={inp}/></div>
          <div>{LBL(t,"Lugar de Expedición")}<input name="lugarExpedicion" value={f.lugarExpedicion} onChange={hc} style={inp}/></div>
          <div style={{gridColumn:"1/-1"}}>{LBL(t,"Dirección de Residencia")}<input name="direccionResidencia" value={f.direccionResidencia} onChange={hc} style={inp}/></div>
          <div>{LBL(t,"Tel. Celular")}<input name="telCelular" value={f.telCelular} onChange={hc} style={inp}/></div>
          <div>{LBL(t,"Tel. Fijo")}<input name="telFijo" value={f.telFijo} onChange={hc} style={inp}/></div>
          <div style={{gridColumn:"1/-1"}}>{LBL(t,"Correo Electrónico Personal")}<input name="correoPersonal" value={f.correoPersonal} onChange={hc} type="email" style={inp}/></div>
        </div>

        {/* 2. Datos de Vinculación */}
        {SEC("2. Datos de Vinculación","#0284c7")}
        <div style={{marginBottom:14}}>
          {LBL(t,"Tipo de Vinculación",true)}
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:6}}>
            {TIPOS_VINCULACION.map(tv=>(
              <label key={tv} onClick={()=>setF(p=>({...p,tipoVinculacion:tv}))} style={{display:"flex",alignItems:"center",gap:7,padding:"8px 14px",background:f.tipoVinculacion===tv?t.accentBg:t.surface2,border:`1.5px solid ${f.tipoVinculacion===tv?t.accent:t.border}`,borderRadius:8,cursor:"pointer",fontSize:12,color:f.tipoVinculacion===tv?t.accent:t.textMid,userSelect:"none",fontWeight:f.tipoVinculacion===tv?700:400}}>
                <div style={{width:14,height:14,border:`2px solid ${f.tipoVinculacion===tv?t.accent:t.border}`,borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {f.tipoVinculacion===tv&&<span style={{fontSize:9,fontWeight:800,color:t.accent}}>✓</span>}
                </div>
                {tv}
              </label>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:12,marginBottom:18}}>
          <div>{LBL(t,"Período Inicial")}<input name="fechaInicio" type="date" value={f.fechaInicio} onChange={hc} style={inp}/></div>
          <div>{LBL(t,"Período Final (vacío=indefinido)")}<input name="fechaFin" type="date" value={f.fechaFin} onChange={hc} style={inp}/></div>
          <div>{LBL(t,"Área de Servicios",true)}<input name="areaServicios" value={f.areaServicios} onChange={hc} placeholder="ej: Terapia del Lenguaje" style={inp}/></div>
          <div>{LBL(t,"Cargo Funcionario(a)",true)}<input name="cargo" value={f.cargo} onChange={hc} style={inp}/></div>
          <div style={{gridColumn:"1/-1"}}>{LBL(t,"N.° Registro (Médico/Enfermería) o Tarjeta Profesional")}<input name="numRegistro" value={f.numRegistro} onChange={hc} style={inp}/></div>
          <div style={{gridColumn:"1/-1"}}>{LBL(t,"Nombre Empresa Contratista (Si aplica)")}<input name="empresaContratista" value={f.empresaContratista} onChange={hc} style={inp}/></div>
          <div>{LBL(t,"Dirección Empresa Contratista (Si aplica)")}<input name="direccionContratista" value={f.direccionContratista} onChange={hc} style={inp}/></div>
          <div>{LBL(t,"Teléfono Empresa Contratista (Si aplica)")}<input name="telContratista" value={f.telContratista} onChange={hc} style={inp}/></div>
        </div>

        {/* 3. Permisos */}
        {SEC("3. Permisos y Accesos Solicitados — Marque con una X","#059669")}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:7,marginBottom:18}}>
          {PERMISOS_LISTA.map(p=>(
            <label key={p} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",background:f.permisos.includes(p)?"rgba(5,150,105,0.08)":t.surface2,border:`1px solid ${f.permisos.includes(p)?"#059669":t.border}`,borderRadius:7,cursor:"pointer",fontSize:12,color:f.permisos.includes(p)?"#059669":t.textMid,userSelect:"none"}}>
              <input type="checkbox" checked={f.permisos.includes(p)} onChange={()=>togglePerm(p)} style={{accentColor:"#059669",width:14,height:14}}/>{p}
            </label>
          ))}
        </div>

        {/* 4. Entrenamiento */}
        {SEC("4. Registro de Actividades de Entrenamiento en los Sistemas de Información","#d97706")}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:12,marginBottom:12}}>
          <div>{LBL(t,"Fecha de Entrenamiento")}<input name="fechaEntrenamiento" type="date" value={f.fechaEntrenamiento} onChange={hc} style={inp}/></div>
          <div>{LBL(t,"Hora Inicio")}<input name="horaInicio" type="time" value={f.horaInicio} onChange={hc} style={inp}/></div>
          <div>{LBL(t,"Hora Finalización")}<input name="horaFin" type="time" value={f.horaFin} onChange={hc} style={inp}/></div>
          <div style={{gridColumn:"1/-1"}}>{LBL(t,"Responsable de Entrenamiento")}<input name="responsableEntrenamiento" value={f.responsableEntrenamiento} onChange={hc} style={inp}/></div>
        </div>
        <div style={{marginBottom:14}}>
          {LBL(t,"Entrenamiento en (Marque)")}
          <div style={{display:"flex",flexWrap:"wrap",gap:7,marginTop:6}}>
            {ENTRENAMIENTO_OPTS.map(o=>(
              <label key={o} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 14px",background:f.entrenamientoEn.includes(o)?"rgba(217,119,6,0.09)":t.surface2,border:`1.5px solid ${f.entrenamientoEn.includes(o)?"#d97706":t.border}`,borderRadius:7,cursor:"pointer",fontSize:12,color:f.entrenamientoEn.includes(o)?"#d97706":t.textMid,userSelect:"none",fontWeight:f.entrenamientoEn.includes(o)?700:400}}>
                <input type="checkbox" checked={f.entrenamientoEn.includes(o)} onChange={()=>toggleEnt(o)} style={{accentColor:"#d97706",width:14,height:14}}/>{o}
              </label>
            ))}
          </div>
        </div>
        <div style={{background:"rgba(217,119,6,0.07)",border:"1px solid rgba(217,119,6,0.3)",borderRadius:8,padding:"10px 14px",marginBottom:20,fontSize:11,color:t.textMid,lineHeight:1.7,fontStyle:"italic"}}>
          Declaro de manera libre, expresa, inequívoca e informada que, conozco del <strong style={{color:t.text,fontStyle:"normal"}}>ACUERDO INDIVIDUAL DE CONFIDENCIALIDAD DE LA INFORMACIÓN FRSGI-001</strong> y que mediante la firma de este documento confirmo y acepto mi responsabilidad para los fines pertinentes.
        </div>

        {/* Fecha recepción TH */}
        <div style={{marginBottom:20}}>
          {LBL(t,"Fecha de Recepción en Talento Humano")}
          <input name="fechaRecepcionTH" type="date" value={f.fechaRecepcionTH} onChange={hc} style={{...inp,maxWidth:220}}/>
        </div>

        <div style={{background:t.surface2,border:`1px solid ${t.border}`,borderRadius:8,padding:"11px 14px",marginBottom:18,fontSize:11,color:t.textMuted,lineHeight:1.7}}>
          📧 Al enviar, se notifica primero al <strong style={{color:t.text}}>Funcionario</strong> (debe subir foto y aceptar T&C). Luego simultáneamente a Coordinador, Contratista y Gestión de Info. Último: <strong style={{color:t.text}}>VBO. Coordinador Talento Humano</strong>.
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",flexWrap:"wrap"}}>
          <button onClick={onClose} style={{background:"transparent",border:`1px solid ${t.border}`,borderRadius:8,padding:"9px 18px",fontSize:13,fontWeight:600,cursor:"pointer",color:t.textMid,display:"flex",alignItems:"center",gap:6}}><Icon name="x" size={13}/>Cancelar</button>
          <button onClick={saveDraft} style={{background:"rgba(234,179,8,0.12)",border:"1px solid rgba(234,179,8,0.4)",borderRadius:8,padding:"9px 18px",fontSize:13,fontWeight:600,cursor:"pointer",color:"#ca8a04",display:"flex",alignItems:"center",gap:6}}><Icon name="save" size={13}/>Guardar Borrador</button>
          <button onClick={trySubmit} style={{background:"linear-gradient(135deg,#7c3aed,#6d28d9)",color:"white",border:"none",borderRadius:8,padding:"9px 20px",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}><Icon name="send" size={13}/>Enviar y Notificar</button>
        </div>
      </div>
    </div>
    {showConfirm&&<ModalConfirmacion
      titulo="¿Confirmar envío?"
      mensaje={`Se enviará la Asignación de Permisos y Claves de "${f.nombre}" a todos los firmantes correspondientes. Por favor verifique que todos los datos son correctos.`}
      onConfirm={()=>{onSubmit({...f,_borrador:false});setShowConfirm(false);}}
      onCancel={()=>setShowConfirm(false)}
      t={t}
      accentColor="#7c3aed"
    />}
    </>
  );
}


export { ModalNuevoPC };
