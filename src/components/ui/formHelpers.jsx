import React from 'react';
const makeInpStyle = t => ({ width:"100%",background:t.inputBg,border:`1px solid ${t.border}`,borderRadius:7,padding:"9px 12px",color:t.text,fontSize:13,outline:"none",fontFamily:"'DM Sans',sans-serif" });
const makeSelStyle = t => ({ ...makeInpStyle(t), cursor:"pointer" });
const LBL = (t,txt,req) => <label style={{display:"block",fontSize:10,fontWeight:700,color:t.textMuted,letterSpacing:0.8,textTransform:"uppercase",marginBottom:4}}>{txt}{req&&<span style={{color:"#ef4444",marginLeft:2}}>*</span>}</label>;

export { makeInpStyle, makeSelStyle, LBL };
