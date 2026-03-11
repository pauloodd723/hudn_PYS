import { useState, useCallback } from 'react';
import { FIRMANTES_PC } from '../../constants';
import { MOCK_PC } from '../../data/mockData';
import { fmtDate, getProgressPC } from '../../utils/helpers';
import { Icon, Badge, ProgressBar, PieChart, makeInpStyle } from '../../components/ui';
import { Tabla } from '../../components/shared';
import { printPC } from '../../print';
import { ModalNuevoPC } from './ModalNuevoPC';
import { ModalDetallePC } from './ModalDetallePC';

function ModuloPermisos({ t, subview, setSubview, showNew, setShowNew }) {
  const [registros,setRegistros]=useState(MOCK_PC);
  const [selected,setSelected]=useState(null);
  const [search,setSearch]=useState(""); const [filtro,setFiltro]=useState("ACTIVOS"); const [fechaF,setFechaF]=useState("");

  const handleSubmit=useCallback(form=>{
    const esBorrador=form._borrador||false;
    const {_borrador,...rest}=form;
    const nuevo={id:registros.length+100,...rest,estado:esBorrador?"BORRADOR":"EN_TRAMITE",archivado:false,fechaCreacion:new Date().toISOString().split("T")[0],firmas:FIRMANTES_PC.map(f=>({firmanteId:f.id,estado:"PENDIENTE",fecha:null,fotoUrl:null}))};
    setRegistros(p=>[nuevo,...p]); setShowNew(false); setSubview("listado");
  },[registros,setShowNew,setSubview]);
  const archive=useCallback(id=>setRegistros(p=>p.map(x=>x.id===id?{...x,archivado:true}:x)),[]);
  const unarchive=useCallback(id=>setRegistros(p=>p.map(x=>x.id===id?{...x,archivado:false}:x)),[]);

  const active=registros.filter(r=>!r.archivado);
  const archivados=registros.filter(r=>r.archivado);
  const filtrados=registros.filter(r=>{
    if(filtro==="ACTIVOS"&&r.archivado)return false;
    if(filtro==="ARCHIVADOS"&&!r.archivado)return false;
    if(!["ACTIVOS","ARCHIVADOS","TODOS"].includes(filtro)&&r.estado!==filtro)return false;
    if(search&&!r.nombre.toLowerCase().includes(search.toLowerCase())&&!r.identificacion.includes(search))return false;
    if(fechaF&&r.fechaInicio!==fechaF)return false;
    return true;
  });

  const card={background:t.surface,border:`1px solid ${t.border}`,borderRadius:14,padding:"22px 20px",marginBottom:16,boxShadow:t.shadow};
  const CT={fontSize:11,fontWeight:700,color:"#7c3aed",letterSpacing:1.2,textTransform:"uppercase",marginBottom:16,display:"flex",alignItems:"center",gap:7};

  const pieData=[
    {label:"Validados",value:active.filter(r=>r.estado==="VALIDADO").length,color:"#22c55e"},
    {label:"En Trámite",value:active.filter(r=>r.estado==="EN_TRAMITE").length,color:"#7c3aed"},
    {label:"Borrador",value:active.filter(r=>r.estado==="BORRADOR").length,color:"#ca8a04"},
    {label:"Cancelados",value:active.filter(r=>r.estado==="CANCELADO").length,color:"#ef4444"},
  ].filter(d=>d.value>0);

  return (
    <div style={{minWidth:0}}>
        {subview==="dashboard"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:12,marginBottom:16}}>
              {[{l:"Activos",v:active.length,c:"#7c3aed",i:"list"},{l:"Validados",v:active.filter(r=>r.estado==="VALIDADO").length,c:"#22c55e",i:"check"},{l:"En Trámite",v:active.filter(r=>r.estado==="EN_TRAMITE").length,c:"#f59e0b",i:"clock"},{l:"Borradores",v:active.filter(r=>r.estado==="BORRADOR").length,c:"#ca8a04",i:"save"},{l:"Cancelados",v:active.filter(r=>r.estado==="CANCELADO").length,c:"#ef4444",i:"cancel"}].map(s=>(
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
                {active.filter(r=>r.estado==="EN_TRAMITE").slice(0,4).map(r=>{const {done,total,pct}=getProgressPC(r.firmas);return(
                  <div key={r.id} onClick={()=>setSelected(r)} style={{padding:"9px 12px",background:t.surface2,borderRadius:8,marginBottom:6,cursor:"pointer",border:`1px solid ${t.border}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,fontWeight:700,color:t.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"80%"}}>{r.nombre}</span><span style={{fontSize:10,color:t.textMuted,flexShrink:0}}>{done}/{total}</span></div>
                    <div style={{height:5,background:t.border,borderRadius:999,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#7c3aed,#a78bfa)",borderRadius:999}}/></div>
                  </div>
                );})}
                {active.filter(r=>r.estado==="EN_TRAMITE").length===0&&<p style={{textAlign:"center",padding:16,color:t.textMuted,fontSize:12}}>Sin trámites activos</p>}
              </div>
              <div style={card}>
                <div style={{fontSize:10,color:t.textMuted,marginBottom:6}}>Proceso de firmas</div>
                {FIRMANTES_PC.map((f,i)=>{
                  const firmados=registros.flatMap(r=>r.firmas).filter(x=>x.firmanteId===f.id&&x.estado==="FIRMADO").length;
                  const total2=registros.length;
                  return(<div key={f.id} style={{marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:t.textMuted,marginBottom:2}}><span style={{maxWidth:"70%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{i+1}. {f.rol}</span><span>{firmados}/{total2}</span></div>
                    <div style={{height:4,background:t.border,borderRadius:999,overflow:"hidden"}}><div style={{height:"100%",width:total2?`${Math.round(firmados/total2*100)}%`:"0%",background:"linear-gradient(90deg,#7c3aed,#a78bfa)",borderRadius:999}}/></div>
                  </div>);
                })}
              </div>
            </div>
          </div>
        )}

        {subview==="listado"&&(
          <div style={card}>
            <div style={CT}><Icon name="list" size={13}/>Registros de Permisos y Claves</div>
            <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"flex-end"}}>
              <div><div style={{fontSize:9,fontWeight:700,color:t.textMuted,letterSpacing:0.8,textTransform:"uppercase",marginBottom:3}}>Buscar</div>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Nombre o ID..." style={{...makeInpStyle(t),width:"min(200px,100%)"}}/></div>
              <div><div style={{fontSize:9,fontWeight:700,color:t.textMuted,letterSpacing:0.8,textTransform:"uppercase",marginBottom:3}}>Fecha Inicio</div>
                <input type="date" value={fechaF} onChange={e=>setFechaF(e.target.value)} style={{...makeInpStyle(t),width:150}}/></div>
              {fechaF&&<button onClick={()=>setFechaF("")} style={{background:"transparent",border:`1px solid ${t.border}`,borderRadius:7,padding:"7px 10px",fontSize:11,color:t.textMid,cursor:"pointer"}}>✕</button>}
              <div style={{display:"flex",gap:5,marginLeft:"auto",flexWrap:"wrap"}}>
                {[["ACTIVOS","Activos"],["EN_TRAMITE","En Trámite"],["BORRADOR","Borradores"],["VALIDADO","Validados"],["CANCELADO","Cancelados"],["ARCHIVADOS","Archivados"]].map(([k,l])=>(
                  <button key={k} onClick={()=>setFiltro(k)} style={{padding:"6px 12px",borderRadius:7,border:`1px solid ${filtro===k?"#7c3aed":t.border}`,background:filtro===k?"rgba(124,58,237,0.1)":"transparent",color:filtro===k?"#7c3aed":t.textMuted,fontSize:11,fontWeight:700,cursor:"pointer"}}>{l}</button>
                ))}
              </div>
            </div>
            <Tabla t={t} cols={[{key:"id",label:"ID"},{key:"nombre",label:"Funcionario"},{key:"tipo",label:"Vinculación"},{key:"area",label:"Área"},{key:"ini",label:"F. Inicio"},{key:"prog",label:"Firmas"},{key:"estado",label:"Estado"},{key:"acc",label:"Acciones"}]}
              rows={filtrados.map(r=>{const {done,total,pct}=getProgressPC(r.firmas);return(
                <tr key={r.id} style={{opacity:r.archivado?0.5:1}}>
                  <td style={{padding:"11px 10px",borderBottom:`1px solid ${t.border}`,fontFamily:"monospace",fontSize:11,color:"#7c3aed"}}>{r.identificacion}</td>
                  <td style={{padding:"11px 10px",borderBottom:`1px solid ${t.border}`,fontWeight:600,color:t.text,fontSize:12,maxWidth:150,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.nombre}</td>
                  <td style={{padding:"11px 10px",borderBottom:`1px solid ${t.border}`,fontSize:11,color:t.textMid,whiteSpace:"nowrap"}}>{r.tipoVinculacion}</td>
                  <td style={{padding:"11px 10px",borderBottom:`1px solid ${t.border}`,fontSize:11,color:t.textMid,maxWidth:130,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.areaServicios}</td>
                  <td style={{padding:"11px 10px",borderBottom:`1px solid ${t.border}`,fontSize:11,color:t.textMid,whiteSpace:"nowrap"}}>{fmtDate(r.fechaInicio)}</td>
                  <td style={{padding:"11px 10px",borderBottom:`1px solid ${t.border}`,minWidth:100}}><div style={{fontSize:10,color:t.textMuted,marginBottom:3}}>{done}/{total}</div><div style={{height:5,background:t.border,borderRadius:999,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:pct===100?"linear-gradient(90deg,#22c55e,#16a34a)":"linear-gradient(90deg,#7c3aed,#a78bfa)",borderRadius:999}}/></div></td>
                  <td style={{padding:"11px 10px",borderBottom:`1px solid ${t.border}`}}><Badge estado={r.archivado?"ARCHIVADO":r.estado}/></td>
                  <td style={{padding:"11px 10px",borderBottom:`1px solid ${t.border}`}}>
                    <div style={{display:"flex",gap:5}}>
                      <button onClick={()=>setSelected(r)} style={{background:"transparent",border:`1px solid ${t.border}`,borderRadius:7,padding:"4px 8px",fontSize:11,cursor:"pointer",color:t.textMid,display:"flex",alignItems:"center",gap:4}}><Icon name="eye" size={11}/>Ver</button>
                      <button onClick={()=>printPC(r)} style={{background:"transparent",border:`1px solid ${t.border}`,borderRadius:7,padding:"4px 8px",fontSize:11,cursor:"pointer",color:"#7c3aed",display:"flex",alignItems:"center",gap:3}}><Icon name="print" size={11}/></button>
                      {!r.archivado?<button onClick={()=>archive(r.id)} style={{background:"transparent",border:`1px solid ${t.border}`,borderRadius:7,padding:"4px 8px",fontSize:11,cursor:"pointer",color:t.textMuted,display:"flex",alignItems:"center",gap:3}}><Icon name="archive" size={11}/></button>
                      :<button onClick={()=>unarchive(r.id)} style={{background:"rgba(234,179,8,0.1)",border:"1px solid rgba(234,179,8,0.3)",borderRadius:7,padding:"4px 8px",fontSize:11,cursor:"pointer",color:"#ca8a04",display:"flex",alignItems:"center",gap:3}}><Icon name="upload" size={11}/></button>}
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
                <div style={CT}><Icon name="file" size={13}/>Completados — Listos para Imprimir</div>
                {active.filter(r=>r.estado==="VALIDADO").map(r=>(
                  <div key={r.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",background:t.surface2,borderRadius:8,marginBottom:6,border:`1px solid ${t.border}`}}>
                    <div>
                      <div style={{fontSize:12,fontWeight:700,color:t.text}}>{r.nombre}</div>
                      <div style={{fontSize:10,color:t.textMuted}}>{r.tipoVinculacion} · {fmtDate(r.fechaInicio)}</div>
                    </div>
                    <div style={{display:"flex",gap:6}}>
                      <button onClick={()=>printPC(r)} style={{background:"linear-gradient(135deg,#7c3aed,#6d28d9)",color:"white",border:"none",borderRadius:7,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><Icon name="print" size={11}/>PDF</button>
                      <button onClick={()=>archive(r.id)} style={{background:"transparent",border:`1px solid ${t.border}`,borderRadius:7,padding:"5px 9px",fontSize:11,cursor:"pointer",color:t.textMuted,display:"flex",alignItems:"center",gap:3}}><Icon name="archive" size={11}/></button>
                    </div>
                  </div>
                ))}
                {active.filter(r=>r.estado==="VALIDADO").length===0&&<p style={{textAlign:"center",padding:20,color:t.textMuted,fontSize:12}}>Sin validados aún</p>}
              </div>
            </div>
            <div style={card}>
              <div style={CT}><Icon name="user" size={13}/>Estado de Firmas por Firmante</div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",minWidth:400}}>
                  <thead><tr>{["#","Firmante","Firmados","Pendientes"].map(h=><th key={h} style={{padding:"8px 10px",textAlign:"left",fontSize:10,fontWeight:700,color:t.textMuted,letterSpacing:0.7,textTransform:"uppercase",borderBottom:`1px solid ${t.border}`}}>{h}</th>)}</tr></thead>
                  <tbody>{FIRMANTES_PC.map((f,i)=>{
                    const firmados=registros.flatMap(r=>r.firmas).filter(x=>x.firmanteId===f.id&&x.estado==="FIRMADO").length;
                    const pendientes=registros.length-firmados;
                    return(<tr key={f.id}>
                      <td style={{padding:"10px 10px",borderBottom:`1px solid ${t.border}`,fontSize:12,fontWeight:700,color:t.text}}>{i+1}</td>
                      <td style={{padding:"10px 10px",borderBottom:`1px solid ${t.border}`,fontSize:12,color:t.textMid}}>{f.rol}</td>
                      <td style={{padding:"10px 10px",borderBottom:`1px solid ${t.border}`}}><span style={{color:"#16a34a",fontWeight:700}}>{firmados}</span></td>
                      <td style={{padding:"10px 10px",borderBottom:`1px solid ${t.border}`}}><span style={{color:pendientes>0?"#d97706":"#16a34a",fontWeight:700}}>{pendientes}</span></td>
                    </tr>);
                  })}</tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {subview==="archivados"&&(
          <div style={card}>
            <div style={CT}><Icon name="archive" size={13}/>Archivados ({archivados.length})</div>
            {archivados.length===0?<div style={{textAlign:"center",padding:36,color:t.textMuted}}><div style={{fontSize:32,marginBottom:8}}>📦</div><p style={{fontSize:13,fontWeight:600}}>Sin archivados</p></div>:(
              <Tabla t={t} cols={[{key:"f",label:"Funcionario"},{key:"id",label:"ID"},{key:"tipo",label:"Vinculación"},{key:"ini",label:"F. Inicio"},{key:"est",label:"Estado"},{key:"acc",label:"Acciones"}]}
                rows={archivados.map(r=>(
                  <tr key={r.id} style={{opacity:0.65}}>
                    <td style={{padding:"11px 10px",borderBottom:`1px solid ${t.border}`,fontWeight:600,color:t.text,fontSize:12}}>{r.nombre}</td>
                    <td style={{padding:"11px 10px",borderBottom:`1px solid ${t.border}`,fontFamily:"monospace",color:"#7c3aed",fontSize:11}}>{r.identificacion}</td>
                    <td style={{padding:"11px 10px",borderBottom:`1px solid ${t.border}`,fontSize:11,color:t.textMid}}>{r.tipoVinculacion}</td>
                    <td style={{padding:"11px 10px",borderBottom:`1px solid ${t.border}`,fontSize:11,color:t.textMid}}>{fmtDate(r.fechaInicio)}</td>
                    <td style={{padding:"11px 10px",borderBottom:`1px solid ${t.border}`}}><Badge estado={r.estado}/></td>
                    <td style={{padding:"11px 10px",borderBottom:`1px solid ${t.border}`}}>
                      <div style={{display:"flex",gap:5}}>
                        <button onClick={()=>setSelected(r)} style={{background:"transparent",border:`1px solid ${t.border}`,borderRadius:7,padding:"4px 8px",fontSize:11,cursor:"pointer",color:t.textMid,display:"flex",alignItems:"center",gap:4}}><Icon name="eye" size={11}/>Ver</button>
                        <button onClick={()=>unarchive(r.id)} style={{background:"rgba(234,179,8,0.1)",border:"1px solid rgba(234,179,8,0.3)",borderRadius:7,padding:"4px 9px",fontSize:11,cursor:"pointer",color:"#ca8a04",display:"flex",alignItems:"center",gap:4,fontWeight:600}}><Icon name="upload" size={11}/>Desarchivar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              />
            )}
          </div>
        )}

      {showNew&&<ModalNuevoPC onClose={()=>setShowNew(false)} onSubmit={handleSubmit} t={t}/>}
      {selected&&<ModalDetallePC pc={selected} onClose={()=>setSelected(null)} onArchive={archive} onUnarchive={unarchive} t={t}/>}
    </div>
  );
}


export { ModuloPermisos };
