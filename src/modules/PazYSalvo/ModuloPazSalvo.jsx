import { useState, useCallback } from 'react';
import { AREAS_PS } from '../../constants';
import { MOCK_PS } from '../../data/mockData';
import { fmtDate, getProgressPS } from '../../utils/helpers';
import { Icon, Badge, ProgressBar, PieChart, makeInpStyle } from '../../components/ui';
import { Tabla } from '../../components/shared';
import { printPS } from '../../print';
import { ModalNuevoPS } from './ModalNuevoPS';
import { ModalDetallePS } from './ModalDetallePS';

function ModuloPazSalvo({ t, subview, setSubview, showNew, setShowNew, pazSalvos: pazSalvosProp, setPazSalvos: setPazSalvosProp }) {
  const [pazSalvosLocal,setPazSalvosLocal]=useState(MOCK_PS);
  const pazSalvos = pazSalvosProp || pazSalvosLocal;
  const setPazSalvos = setPazSalvosProp || setPazSalvosLocal;
  const [selected,setSelected]=useState(null);
  const [search,setSearch]=useState(""); const [filtro,setFiltro]=useState("ACTIVOS"); const [fechaF,setFechaF]=useState("");

  const handleSubmit=useCallback(form=>{
    const nuevo={id:pazSalvos.length+100,...form,estado:"EN_TRAMITE",archivado:false,fechaCreacion:new Date().toISOString().split("T")[0],validaciones:AREAS_PS.map(a=>({areaId:a.id,estado:"PENDIENTE",fecha:null}))};
    setPazSalvos(p=>[nuevo,...p]); setShowNew(false); setSubview("listado");
  },[pazSalvos,setShowNew,setSubview]);
  const archive=useCallback(id=>setPazSalvos(p=>p.map(x=>x.id===id?{...x,archivado:true}:x)),[]);
  const unarchive=useCallback(id=>setPazSalvos(p=>p.map(x=>x.id===id?{...x,archivado:false}:x)),[]);

  const active=pazSalvos.filter(p=>!p.archivado);
  const archivados=pazSalvos.filter(p=>p.archivado);
  const filtrados=pazSalvos.filter(p=>{
    if(filtro==="ACTIVOS"&&p.archivado)return false;
    if(filtro==="ARCHIVADOS"&&!p.archivado)return false;
    if(!["ACTIVOS","ARCHIVADOS","TODOS"].includes(filtro)&&p.estado!==filtro)return false;
    if(search&&!p.nombre.toLowerCase().includes(search.toLowerCase())&&!p.identificacion.includes(search))return false;
    if(fechaF&&p.fechaRetiro!==fechaF)return false;
    return true;
  });

  const {done:tDone,total:tTotal}=pazSalvos.reduce((a,p)=>{const g=getProgressPS(p.validaciones);return{done:a.done+g.done,total:a.total+g.total};},{done:0,total:0});
  const gPct=tTotal?Math.round(tDone/tTotal*100):0;

  const card={background:t.surface,border:`1px solid ${t.border}`,borderRadius:14,padding:"22px 20px",marginBottom:16,boxShadow:t.shadow};
  const CT={fontSize:11,fontWeight:700,color:t.accent,letterSpacing:1.2,textTransform:"uppercase",marginBottom:16,display:"flex",alignItems:"center",gap:7};

  const pieData=[
    {label:"Validados",value:active.filter(p=>p.estado==="VALIDADO").length,color:"#22c55e"},
    {label:"En Trámite",value:active.filter(p=>p.estado==="EN_TRAMITE").length,color:"#0ea5e9"},
    {label:"Cancelados",value:active.filter(p=>p.estado==="CANCELADO").length,color:"#ef4444"},
  ].filter(d=>d.value>0);

  return (
    <div style={{minWidth:0}}>
      {subview==="dashboard"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:12,marginBottom:16}}>
              {[{l:"Activos",v:active.length,c:"#0ea5e9",i:"list"},{l:"Validados",v:active.filter(p=>p.estado==="VALIDADO").length,c:"#22c55e",i:"check"},{l:"En Trámite",v:active.filter(p=>p.estado==="EN_TRAMITE").length,c:"#f59e0b",i:"clock"},{l:"Cancelados",v:active.filter(p=>p.estado==="CANCELADO").length,c:"#ef4444",i:"cancel"},{l:"Archivados",v:archivados.length,c:"#94a3b8",i:"archive"}].map(s=>(
                <div key={s.l} style={{background:t.surface,border:`1px solid ${s.c}22`,borderRadius:12,padding:"14px 16px",boxShadow:t.shadow}}>
                  <div style={{color:s.c,opacity:0.7,marginBottom:4}}><Icon name={s.i} size={14}/></div>
                  <div style={{fontSize:24,fontWeight:800,color:s.c,lineHeight:1}}>{s.v}</div>
                  <div style={{fontSize:11,color:t.textMuted,fontWeight:600}}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14}}>
              <div style={card}><div style={CT}><Icon name="chart" size={13}/>Estados</div><PieChart data={pieData} size={140} t={t}/></div>
              <div style={card}>
                <div style={CT}><Icon name="clock" size={13}/>En Trámite Recientes</div>
                {active.filter(p=>p.estado==="EN_TRAMITE").slice(0,4).map(p=>{const {done,total,pct}=getProgressPS(p.validaciones);return(
                  <div key={p.id} onClick={()=>setSelected({type:"ps",data:p})} style={{padding:"9px 12px",background:t.surface2,borderRadius:8,marginBottom:6,cursor:"pointer",border:`1px solid ${t.border}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,fontWeight:700,color:t.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"80%"}}>{p.nombre}</span><span style={{fontSize:10,color:t.textMuted,flexShrink:0}}>{done}/{total}</span></div>
                    <ProgressBar pct={pct} t={t}/>
                  </div>
                );})}
                {active.filter(p=>p.estado==="EN_TRAMITE").length===0&&<p style={{textAlign:"center",padding:16,color:t.textMuted,fontSize:12}}>Sin trámites activos</p>}
              </div>
              <div style={card}>
                <div style={{fontSize:10,color:t.textMuted,marginBottom:6}}>Validaciones globales</div>
                <div style={{fontSize:28,fontWeight:800,color:t.accent,lineHeight:1,marginBottom:6}}>{tDone}<span style={{fontSize:13,color:t.textMuted,fontWeight:400}}>/{tTotal}</span></div>
                <ProgressBar pct={gPct} t={t}/>
                <div style={{fontSize:11,color:t.textMuted,marginTop:4}}>{gPct}% completado</div>
              </div>
            </div>
          </div>
        )}

        {subview==="listado"&&(
          <div style={card}>
            <div style={CT}><Icon name="list" size={13}/>Paz y Salvos Registrados</div>
            <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"flex-end"}}>
              <div><div style={{fontSize:9,fontWeight:700,color:t.textMuted,letterSpacing:0.8,textTransform:"uppercase",marginBottom:3}}>Buscar</div>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Nombre o ID..." style={{...makeInpStyle(t),width:"min(200px,100%)"}}/></div>
              <div><div style={{fontSize:9,fontWeight:700,color:t.textMuted,letterSpacing:0.8,textTransform:"uppercase",marginBottom:3}}>Fecha Retiro</div>
                <input type="date" value={fechaF} onChange={e=>setFechaF(e.target.value)} style={{...makeInpStyle(t),width:150}}/></div>
              {fechaF&&<button onClick={()=>setFechaF("")} style={{background:"transparent",border:`1px solid ${t.border}`,borderRadius:7,padding:"7px 10px",fontSize:11,color:t.textMid,cursor:"pointer"}}>✕</button>}
              <div style={{display:"flex",gap:5,marginLeft:"auto",flexWrap:"wrap"}}>
                {[["ACTIVOS","Activos"],["EN_TRAMITE","En Trámite"],["VALIDADO","Validados"],["CANCELADO","Cancelados"],["ARCHIVADOS","Archivados"]].map(([k,l])=>(
                  <button key={k} onClick={()=>setFiltro(k)} style={{padding:"6px 12px",borderRadius:7,border:`1px solid ${filtro===k?t.accent:t.border}`,background:filtro===k?t.accentBg:"transparent",color:filtro===k?t.accent:t.textMuted,fontSize:11,fontWeight:700,cursor:"pointer"}}>{l}</button>
                ))}
              </div>
            </div>
            <Tabla t={t} cols={[{key:"id",label:"ID"},{key:"nombre",label:"Funcionario"},{key:"dependencia",label:"Dependencia"},{key:"retiro",label:"F. Retiro"},{key:"prog",label:"Progreso"},{key:"estado",label:"Estado"},{key:"acc",label:"Acciones"}]}
              rows={filtrados.map(p=>{const {done,total,pct}=getProgressPS(p.validaciones);return(
                <tr key={p.id} style={{opacity:p.archivado?0.5:1}}>
                  <td style={{padding:"11px 10px",borderBottom:`1px solid ${t.border}`,fontFamily:"monospace",fontSize:11,color:t.accent}}>{p.identificacion}</td>
                  <td style={{padding:"11px 10px",borderBottom:`1px solid ${t.border}`,fontWeight:600,color:t.text,fontSize:12,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.nombre}</td>
                  <td style={{padding:"11px 10px",borderBottom:`1px solid ${t.border}`,fontSize:11,color:t.textMid,maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.dependencia}</td>
                  <td style={{padding:"11px 10px",borderBottom:`1px solid ${t.border}`,fontSize:11,color:t.textMid,whiteSpace:"nowrap"}}>{fmtDate(p.fechaRetiro)}</td>
                  <td style={{padding:"11px 10px",borderBottom:`1px solid ${t.border}`,minWidth:100}}><div style={{fontSize:10,color:t.textMuted,marginBottom:3}}>{done}/{total}</div><ProgressBar pct={pct} t={t}/></td>
                  <td style={{padding:"11px 10px",borderBottom:`1px solid ${t.border}`}}><Badge estado={p.archivado?"ARCHIVADO":p.estado}/></td>
                  <td style={{padding:"11px 10px",borderBottom:`1px solid ${t.border}`}}>
                    <div style={{display:"flex",gap:5}}>
                      <button onClick={()=>setSelected({type:"ps",data:p})} style={{background:"transparent",border:`1px solid ${t.border}`,borderRadius:7,padding:"4px 8px",fontSize:11,cursor:"pointer",color:t.textMid,display:"flex",alignItems:"center",gap:4}}><Icon name="eye" size={11}/>Ver</button>
                      <button onClick={()=>printPS(p)} style={{background:"transparent",border:`1px solid ${t.border}`,borderRadius:7,padding:"4px 8px",fontSize:11,cursor:"pointer",color:t.accent,display:"flex",alignItems:"center",gap:3}}><Icon name="print" size={11}/></button>
                      {!p.archivado?<button onClick={()=>archive(p.id)} style={{background:"transparent",border:`1px solid ${t.border}`,borderRadius:7,padding:"4px 8px",fontSize:11,cursor:"pointer",color:t.textMuted,display:"flex",alignItems:"center",gap:3}}><Icon name="archive" size={11}/></button>
                      :<button onClick={()=>unarchive(p.id)} style={{background:"rgba(234,179,8,0.1)",border:"1px solid rgba(234,179,8,0.3)",borderRadius:7,padding:"4px 8px",fontSize:11,cursor:"pointer",color:"#ca8a04",display:"flex",alignItems:"center",gap:3}}><Icon name="upload" size={11}/></button>}
                    </div>
                  </td>
                </tr>
              );})}
            />
          </div>
        )}

        {subview==="reportes"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14,marginBottom:14}}>
              <div style={card}><div style={CT}><Icon name="chart" size={13}/>Distribución</div><PieChart data={pieData} size={140} t={t}/></div>
              <div style={card}>
                <div style={CT}><Icon name="file" size={13}/>Listos para Imprimir</div>
                {active.filter(p=>p.estado==="VALIDADO").map(p=>(
                  <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",background:t.surface2,borderRadius:8,marginBottom:6,border:`1px solid ${t.border}`}}>
                    <div>
                      <div style={{fontSize:12,fontWeight:700,color:t.text}}>{p.nombre}</div>
                      <div style={{fontSize:10,color:t.textMuted}}>{fmtDate(p.fechaRetiro)}</div>
                    </div>
                    <div style={{display:"flex",gap:6}}>
                      <button onClick={()=>printPS(p)} style={{background:"linear-gradient(135deg,#16a34a,#15803d)",color:"white",border:"none",borderRadius:7,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><Icon name="print" size={11}/>PDF</button>
                      <button onClick={()=>archive(p.id)} style={{background:"transparent",border:`1px solid ${t.border}`,borderRadius:7,padding:"5px 9px",fontSize:11,cursor:"pointer",color:t.textMuted,display:"flex",alignItems:"center",gap:3}}><Icon name="archive" size={11}/></button>
                    </div>
                  </div>
                ))}
                {active.filter(p=>p.estado==="VALIDADO").length===0&&<p style={{textAlign:"center",padding:20,color:t.textMuted,fontSize:12}}>Sin validados aún</p>}
              </div>
            </div>
          </div>
        )}

        {subview==="archivados"&&(
          <div style={card}>
            <div style={CT}><Icon name="archive" size={13}/>Archivados ({archivados.length})</div>
            {archivados.length===0?<div style={{textAlign:"center",padding:36,color:t.textMuted}}><div style={{fontSize:32,marginBottom:8}}>📦</div><p style={{fontSize:13,fontWeight:600}}>Sin archivados</p></div>:(
              <Tabla t={t} cols={[{key:"f",label:"Funcionario"},{key:"id",label:"ID"},{key:"dep",label:"Dependencia"},{key:"ret",label:"F. Retiro"},{key:"est",label:"Estado"},{key:"acc",label:"Acciones"}]}
                rows={archivados.map(p=>(
                  <tr key={p.id} style={{opacity:0.65}}>
                    <td style={{padding:"11px 10px",borderBottom:`1px solid ${t.border}`,fontWeight:600,color:t.text,fontSize:12}}>{p.nombre}</td>
                    <td style={{padding:"11px 10px",borderBottom:`1px solid ${t.border}`,fontFamily:"monospace",color:t.accent,fontSize:11}}>{p.identificacion}</td>
                    <td style={{padding:"11px 10px",borderBottom:`1px solid ${t.border}`,fontSize:11,color:t.textMid}}>{p.dependencia}</td>
                    <td style={{padding:"11px 10px",borderBottom:`1px solid ${t.border}`,fontSize:11,color:t.textMid}}>{fmtDate(p.fechaRetiro)}</td>
                    <td style={{padding:"11px 10px",borderBottom:`1px solid ${t.border}`}}><Badge estado={p.estado}/></td>
                    <td style={{padding:"11px 10px",borderBottom:`1px solid ${t.border}`}}>
                      <div style={{display:"flex",gap:5}}>
                        <button onClick={()=>setSelected({type:"ps",data:p})} style={{background:"transparent",border:`1px solid ${t.border}`,borderRadius:7,padding:"4px 8px",fontSize:11,cursor:"pointer",color:t.textMid,display:"flex",alignItems:"center",gap:4}}><Icon name="eye" size={11}/>Ver</button>
                        <button onClick={()=>unarchive(p.id)} style={{background:"rgba(234,179,8,0.1)",border:"1px solid rgba(234,179,8,0.3)",borderRadius:7,padding:"4px 9px",fontSize:11,cursor:"pointer",color:"#ca8a04",display:"flex",alignItems:"center",gap:4,fontWeight:600}}><Icon name="upload" size={11}/>Desarchivar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              />
            )}
          </div>
        )}

      {showNew&&<ModalNuevoPS onClose={()=>setShowNew(false)} onSubmit={handleSubmit} t={t}/>}
      {selected?.type==="ps"&&<ModalDetallePS ps={selected.data} onClose={()=>setSelected(null)} onArchive={archive} onUnarchive={unarchive} t={t}/>}
    </div>
  );
}


export { ModuloPazSalvo };
