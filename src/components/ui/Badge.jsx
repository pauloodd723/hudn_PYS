import React from 'react';
function Badge({ estado }) {
  const map = {
    VALIDADO:   {bg:"rgba(22,101,52,0.18)",  color:"#16a34a", label:"Validado"},
    FIRMADO:    {bg:"rgba(22,101,52,0.18)",  color:"#16a34a", label:"Firmado"},
    PENDIENTE:  {bg:"rgba(180,83,9,0.15)",   color:"#d97706", label:"Pendiente"},
    CANCELADO:  {bg:"rgba(185,28,28,0.15)",  color:"#dc2626", label:"Cancelado"},
    EN_TRAMITE: {bg:"rgba(37,99,235,0.15)",  color:"#2563eb", label:"En Trámite"},
    ARCHIVADO:  {bg:"rgba(100,116,139,0.15)",color:"#64748b", label:"Archivado"},
    BORRADOR:   {bg:"rgba(234,179,8,0.15)",  color:"#ca8a04", label:"Borrador"},
  };
  const s=map[estado]||map.PENDIENTE;
  return <span style={{background:s.bg,color:s.color,padding:"3px 10px",borderRadius:999,fontSize:11,fontWeight:700}}>{s.label}</span>;
}


export { Badge };
