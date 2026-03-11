const fmtDate = d => { if(!d) return "—"; const [y,m,day]=d.split("-"); return `${day}/${m}/${y}`; };
const getProgressPS = v => { const t=v.length, d=v.filter(x=>x.estado==="VALIDADO").length; return {done:d,total:t,pct:t?Math.round(d/t*100):0}; };
const getProgressPC = f => { const t=f.length, d=f.filter(x=>x.estado==="FIRMADO").length; return {done:d,total:t,pct:t?Math.round(d/t*100):0}; };

export { fmtDate, getProgressPS, getProgressPC };
