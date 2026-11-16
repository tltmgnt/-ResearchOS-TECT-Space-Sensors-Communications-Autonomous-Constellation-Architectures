export const EARTH_KM=6371;
const rad=d=>d*Math.PI/180;
export function vector(lat,lon,r){return [r*Math.cos(rad(lat))*Math.cos(rad(lon)),r*Math.cos(rad(lat))*Math.sin(rad(lon)),r*Math.sin(rad(lat))];}
const dot=(a,b)=>a.reduce((n,x,i)=>n+x*b[i],0),sub=(a,b)=>a.map((x,i)=>x-b[i]),norm=a=>Math.hypot(...a);
export function visible(sat,site,elevation){
 const a=vector(sat.lat,sat.lon,EARTH_KM+sat.altitudeKm),g=vector(site.lat,site.lon,EARTH_KM),d=sub(a,g);
 return dot(d,g)/(norm(d)*EARTH_KM)>=Math.sin(rad(elevation))-1e-12;
}
export function crosslink(a,b,range){
 const x=vector(a.lat,a.lon,EARTH_KM+a.altitudeKm),y=vector(b.lat,b.lon,EARTH_KM+b.altitudeKm),d=sub(y,x),length=norm(d);
 if(length>range)return false;
 const t=length===0?0:Math.max(0,Math.min(1,-dot(x,d)/dot(d,d)));
 return norm(x.map((v,i)=>v+t*d[i]))>EARTH_KM+1e-9;
}
export function validate(s){
 if(!s||s.version!==1||typeof s.name!=='string'||!s.name.trim())throw Error('Name and version 1 required.');
 for(const k of ['review','source'])if(typeof s[k]!=='string')throw Error(k+' must be text.');
 if(typeof s.minElevation!=='number'||!Number.isFinite(s.minElevation)||s.minElevation<0||s.minElevation>90)throw Error('Elevation must be 0–90 degrees.');
 if(typeof s.crosslinkKm!=='number'||!Number.isFinite(s.crosslinkKm)||s.crosslinkKm<0||s.crosslinkKm>20000)throw Error('Crosslink range must be 0–20000 km.');
 for(const [key,max]of [['satellites',150],['sites',100]]){
  if(!Array.isArray(s[key])||!s[key].length||s[key].length>max)throw Error('Use 1–'+max+' '+key+'.');
  const ids=new Set();for(const p of s[key]){
   if(typeof p.id!=='string'||!p.id.trim()||ids.has(p.id))throw Error('Unique nonempty IDs required in '+key);ids.add(p.id);
   for(const [k,limit]of [['lat',90],['lon',180]])if(typeof p[k]!=='number'||!Number.isFinite(p[k])||Math.abs(p[k])>limit)throw Error('Invalid '+k);
   if(key==='satellites'&&(typeof p.altitudeKm!=='number'||!Number.isFinite(p.altitudeKm)||p.altitudeKm<160||p.altitudeKm>2000))throw Error('Altitude must be 160–2000 km.');
  }
 }
 if(!Array.isArray(s.disabled)||new Set(s.disabled).size!==s.disabled.length||s.disabled.some(id=>!s.satellites.some(p=>p.id===id)))throw Error('Disabled IDs must identify unique satellites.');
 if(!s.sites.some(p=>p.id===s.gateway))throw Error('Gateway must identify a ground site.');
 return s;
}
function snapshot(s,disabled,label){
 const sats=s.satellites.filter(p=>!disabled.includes(p.id)),adj=sats.map(()=>[]),edges=[];
 for(let i=0;i<sats.length;i++)for(let j=i+1;j<sats.length;j++)if(crosslink(sats[i],sats[j],s.crosslinkKm)){adj[i].push(j);adj[j].push(i);edges.push([sats[i].id,sats[j].id]);}
 const gateway=s.sites.find(p=>p.id===s.gateway),dist=sats.map(p=>visible(p,gateway,s.minElevation)?0:Infinity),queue=[];
 dist.forEach((d,i)=>{if(d===0)queue.push(i);});
 for(let q=0;q<queue.length;q++){const i=queue[q];for(const j of adj[i])if(dist[j]===Infinity){dist[j]=dist[i]+1;queue.push(j);}}
 const sites=s.sites.map(site=>{const seen=sats.map((sat,i)=>visible(sat,site,s.minElevation)?i:-1).filter(i=>i>=0),hops=Math.min(Infinity,...seen.map(i=>dist[i]));return {id:site.id,visibleSatellites:seen.map(i=>sats[i].id),geometricAccess:seen.length>0,gatewayReachable:Number.isFinite(hops),crosslinkHops:Number.isFinite(hops)?hops:null};});
 return {scenario:label,activeSatellites:sats.length,crosslinks:edges.length,accessibleSites:sites.filter(p=>p.geometricAccess).length,reachableSites:sites.filter(p=>p.gatewayReachable).length,siteCount:sites.length,sites,edges,activeIds:sats.map(p=>p.id)};
}
export function evaluate(s){validate(s);return [snapshot(s,[],'Baseline'),snapshot(s,s.disabled,'Declared outage')];}
export function csv(rows){
 const quote=v=>'"'+String(v??'').replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';
 return [['scenario','site','geometricAccess','gatewayReachable','crosslinkHops','visibleSatellites'],...rows.flatMap(r=>r.sites.map(p=>[r.scenario,p.id,p.geometricAccess,p.gatewayReachable,p.crosslinkHops,p.visibleSatellites.join(';')]))].map(r=>r.map(quote).join(',')).join('\r\n');
}
