import React from 'react';
function PieChart({ data, size=150, t }) {
  const total=data.reduce((s,d)=>s+d.value,0);
  if(!total) return <div style={{textAlign:"center",color:t.textMuted,fontSize:12,padding:20}}>Sin datos</div>;
  let cum=-Math.PI/2;
  const cx=size/2,cy=size/2,r=size/2-10;
  const slices=data.map(d=>{
    const start=cum,sweep=(d.value/total)*2*Math.PI; cum+=sweep;
    const x1=cx+r*Math.cos(start),y1=cy+r*Math.sin(start),x2=cx+r*Math.cos(cum),y2=cy+r*Math.sin(cum);
    return {...d,path:`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${sweep>Math.PI?1:0},1 ${x2},${y2} Z`};
  });
  return (
    <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
      <svg width={size} height={size} style={{flexShrink:0}}>
        {slices.map((s,i)=><path key={i} d={s.path} fill={s.color} stroke={t.surface} strokeWidth={2.5}/>)}
        <circle cx={cx} cy={cy} r={r*0.44} fill={t.surface}/>
        <text x={cx} y={cy-5} textAnchor="middle" fill={t.text} fontSize={14} fontWeight={800}>{total}</text>
        <text x={cx} y={cy+10} textAnchor="middle" fill={t.textMuted} fontSize={8}>TOTAL</text>
      </svg>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {slices.map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:7}}>
            <div style={{width:9,height:9,borderRadius:3,background:s.color,flexShrink:0}}/>
            <div><div style={{fontSize:13,fontWeight:800,color:s.color,lineHeight:1}}>{s.value}</div>
              <div style={{fontSize:10,color:t.textMuted}}>{s.label}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { PieChart };
