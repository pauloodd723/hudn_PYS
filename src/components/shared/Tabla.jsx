import React from 'react';
function Tabla({ cols, rows, t }) {
  return (
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",minWidth:560}}>
        <thead><tr>{cols.map(c=><th key={c.key} style={{padding:"8px 10px",textAlign:"left",fontSize:10,fontWeight:700,color:t.textMuted,letterSpacing:0.7,textTransform:"uppercase",borderBottom:`1px solid ${t.border}`,whiteSpace:"nowrap"}}>{c.label}</th>)}</tr></thead>
        <tbody>{rows.length===0?<tr><td colSpan={cols.length} style={{padding:28,textAlign:"center",color:t.textMuted,fontSize:12}}>Sin resultados</td></tr>:rows}</tbody>
      </table>
    </div>
  );
}


export { Tabla };
