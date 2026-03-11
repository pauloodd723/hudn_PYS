import React from 'react';
function ProgressBar({ pct, t, color }) {
  return (
    <div style={{height:5,background:t.border,borderRadius:999,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${pct}%`,background:color||(pct===100?"linear-gradient(90deg,#22c55e,#16a34a)":"linear-gradient(90deg,#0284c7,#38bdf8)"),borderRadius:999,transition:"width 0.5s"}}/>
    </div>
  );
}


export { ProgressBar };
