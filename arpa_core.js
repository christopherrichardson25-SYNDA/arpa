
// arpa_core.js — lógica mínima del Agente ARPA (sin dependencias)
function scoreAgent(agent, topicTags){
  const tags = (agent.audiencia_tags||'').split(',').map(x=>x.trim().toLowerCase())
  const overlap = topicTags.filter(t=>tags.includes(t)).length
  const sRS = (parseFloat(agent.baseline_RS)||0) * 100
  const sRho = (parseFloat(agent.baseline_rho)||0)
  return overlap*10 + sRS + sRho
}
function pickAgents(agents, topic){
  const topicTags = topic.split(/\W+/).map(t=>t.toLowerCase()).filter(Boolean)
  return agents
    .filter(a=>a.estado==='activo' && a.canal==='LinkedIn')
    .map(a=>({agent:a, score:scoreAgent(a, topicTags)}))
    .sort((a,b)=>b.score-a.score)
    .slice(0,8)
}
function makeUTM(base, agentName, campaign){
  const src = encodeURIComponent(agentName.replace(/\s+/g,'_'))
  return `${base}?utm_source=${src}&utm_campaign=${encodeURIComponent(campaign)}`
}
function calcRS({imp, sv, sh, watch, dur}){
  const svp = imp>0 ? sv/imp : 0
  const shp = imp>0 ? sh/imp : 0
  const R = dur>0 ? Math.min(watch/dur, 1) : 1
  return (svp + shp) * R
}
function calcRho({imp, seg}){
  return imp>0 ? (seg/imp)*1000 : 0
}
module.exports = { pickAgents, makeUTM, calcRS, calcRho };
