function k(a={}){let e={superspines:0,spines:2,leaves:4,clientsPerLeaf:1,clientMultihoming:!1,clientBonding:!1,igp:"ebgp",overlay:"none",dualLoopback:!1,srv6Static:!1,srv6Usid:!1,...a};for(let[o,s,t]of[["superspines",0,16],["spines",1,128],["leaves",1,256],["clientsPerLeaf",0,8]])if(e[o]=Number(e[o]),!Number.isInteger(e[o])||e[o]<s||e[o]>t)throw new Error(`${o} must be an integer between ${s} and ${t}`);if(!["ospf","isis","ebgp"].includes(e.igp))throw new Error("Choose OSPF, IS-IS, or eBGP");if(!["none","vxlan","srv6"].includes(e.overlay))throw new Error("Choose none, VXLAN, or SRv6");if(e.clientBonding&&(e.clientMultihoming=!0),e.clientMultihoming&&e.leaves%2)throw new Error("Client multihoming requires an even number of leaves for leaf pairs");if(e.clientMultihoming&&e.leaves<2)throw new Error("Client multihoming requires at least two leaves");if(e.spines*(e.leaves+e.superspines)+e.leaves*e.clientsPerLeaf*(e.clientMultihoming?2:1)>1e6)throw new Error("This design exceeds 1,000,000 links; reduce the fabric size");return e.dualLoopback=e.overlay!=="none"&&!!e.dualLoopback,e.srv6Static=e.overlay==="srv6"&&!!e.srv6Static,e.srv6Usid=e.overlay==="srv6"&&!!e.srv6Usid,e}function A(a){let e=k(a),o=e.igp==="ebgp"?"bgp":e.igp,s=[o];e.overlay==="vxlan"&&s.push("vlan"),e.overlay!=="none"&&s.push(e.overlay);let t={name:"designed-fabric",module:["fabric"],fabric:{superspines:e.superspines,spines:e.spines,leafs:e.leaves,clients:{per_leaf:e.clientsPerLeaf,multihoming:!!e.clientMultihoming},superspine:{module:[o]},spine:{module:[o]},leaf:{name:`L{count:0${Math.max(2,String(e.leaves).length)}d}`,module:s}}};if(e.spines*(e.leaves+e.superspines)>16384&&(t.fabric.link={unnumbered:!0}),e.dualLoopback&&(t.fabric.dual_loopback=!0,t.addressing={"loopback-vtep":{ipv4:"10.255.0.0/16",prefix:32}},e.overlay==="srv6"&&(t.addressing.loopback={ipv6:"2001:db8:0::/48",prefix6:128},t.addressing["loopback-vtep"].ipv6="2001:db8:ffff::/48",t.addressing["loopback-vtep"].prefix6=128)),e.overlay==="vxlan"){t.vlans={clients:{mode:"irb",gateway:!0}};let c=e.superspines+e.spines+e.leaves*(1+e.clientsPerLeaf);if(c>254){let r=32-Math.ceil(Math.log2(c+2));t.vlans.clients.prefix={ipv4:`172.16.0.0/${r}`}}t.fabric.clients.vlan="clients"}return e.clientBonding&&(t.fabric.clients.bonding="active-backup"),e.igp==="ebgp"&&(t.fabric.leaf.bgp={as:"{65000 + count}"},t.fabric.spine.bgp={as:e.superspines?"{65200 + count}":65200},t.fabric.superspine.bgp={as:65300}),e.overlay==="srv6"&&(t.fabric.leaf.srv6={static:e.srv6Static,srv6_usid:e.srv6Usid}),t}function x(a,e=0){let o=" ".repeat(e);return Array.isArray(a)?a.map(s=>typeof s=="object"?`${o}- ${x(s,e+2).trimStart()}`:`${o}- ${JSON.stringify(s)}`).join(`
`):Object.entries(a).map(([s,t])=>t&&typeof t=="object"&&Object.keys(t).length?`${o}${s}:
${x(t,e+2)}`:`${o}${s}: ${JSON.stringify(t)}`).join(`
`)}function P(a){return`---
${x(A(a))}
---
`}async function S(a,e){let o=P(a),s=new Blob([o]).stream().pipeThrough(new CompressionStream("gzip")),t=new Uint8Array(await new Response(s).arrayBuffer()),c="";for(let l of t)c+=String.fromCharCode(l);let r=new URL(e);for(let l of[...r.searchParams.keys()])(["lab","repo","source","fabric-designer"].includes(l)||l.startsWith("topology."))&&r.searchParams.delete(l);return r.hash=new URLSearchParams({lab:btoa(c)}).toString(),r}var U=0;function $(a){let e=document.createElement("style");e.textContent=`.capture-menu {
  position: relative;
  display: inline-flex;
  min-width: 0;
  max-width: 100%;
}
.capture-menu select[hidden], .capture-menu-options[hidden] { display: none !important; }
.capture-menu-trigger, .capture-menu-options button {
  font: 500 12px/1.3 "JetBrains Mono", ui-monospace, monospace;
  padding: 6px 8px;
  border: 1px solid var(--border, #334);
  border-radius: 8px;
  background: var(--panel-solid, #101826);
  color: var(--text, var(--fg, #e8eef7));
  text-align: left;
  cursor: pointer;
}
.capture-menu-trigger {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.capture-menu-trigger:disabled { opacity: .45; cursor: default; }
.capture-menu-options {
  position: fixed;
  z-index: 100;
  margin: 0;
  inset: auto;
  min-width: 100%;
  width: max-content;
  max-width: min(40rem, 80vw);
  max-height: 16rem;
  overflow: auto;
  padding: 4px;
  border: 1px solid var(--border, #334);
  border-radius: 8px;
  background: var(--panel-solid, #101826);
  box-shadow: 0 8px 24px #0008;
}
.capture-menu-options button {
  display: block;
  width: 100%;
  border-color: transparent;
  white-space: normal;
  overflow-wrap: anywhere;
}
.capture-menu-options button:hover,
.capture-menu-options button:focus-visible,
.capture-menu-options button[aria-selected="true"] {
  background: color-mix(in srgb, var(--accent, #2dd4bf) 18%, var(--panel-solid, #101826));
  border-color: var(--accent, #2dd4bf);
}
.capture-menu button:focus-visible { outline: 2px solid var(--accent, #2dd4bf); outline-offset: -2px; }
`,document.head.append(e);let o=[],s=()=>{};for(let t of a){if(!t.id)do t.id=`capture-select-${++U}`;while(document.getElementById(`${t.id}-trigger`));let c=document.createElement("span");c.className="capture-menu",t.before(c),c.append(t),t.hidden=!0;let r=document.createElement("button");r.type="button",r.className="capture-menu-trigger",r.setAttribute("aria-haspopup","listbox"),r.setAttribute("aria-expanded","false");let l=t.closest("label"),d=t.getAttribute("aria-label")||[...l?.childNodes||[]].filter(i=>i.nodeType===3).map(i=>i.textContent.trim()).join(" ").trim();l&&(l.htmlFor=`${t.id}-trigger`),r.id=`${t.id}-trigger`;let n=document.createElement("div");n.id=`${t.id}-menu`,n.className="capture-menu-options",n.setAttribute("popover","manual"),n.setAttribute("role","listbox"),n.setAttribute("aria-label",d),n.hidden=!0,r.setAttribute("aria-controls",n.id),c.append(r,n);let p=(i=!1)=>{n.hidePopover(),n.hidden=!0,r.setAttribute("aria-expanded","false"),i&&r.focus()},f=()=>{let i=t.selectedOptions[0]?.textContent||"Choose\u2026";r.textContent=`${i} \u25BE`,r.setAttribute("aria-label",`${d}: ${i}`),r.disabled=t.disabled,t.disabled&&p();for(let u of n.children)u.setAttribute("aria-selected",String(u.dataset.value===t.value))},h=(i=!1)=>{if(t.disabled)return;s(),s=p,n.replaceChildren();for(let b of t.options){let m=document.createElement("button");m.type="button",m.setAttribute("role","option"),m.tabIndex=-1,m.textContent=b.textContent,m.dataset.value=b.value,m.disabled=b.disabled,m.addEventListener("click",C=>{C.preventDefault(),t.value=b.value,t.dispatchEvent(new Event("input",{bubbles:!0})),t.dispatchEvent(new Event("change",{bubbles:!0})),f(),p(!0)}),n.append(m)}f(),n.hidden=!1;let u=r.getBoundingClientRect();n.style.minWidth=`${u.width}px`,n.style.maxHeight="16rem",n.showPopover();let g=n.offsetWidth,y=n.offsetHeight;n.style.left=`${Math.max(4,Math.min(u.left,innerWidth-g-4))}px`;let v=innerHeight-u.bottom-4,E=u.top-4,L=v<Math.min(y,160)&&E>v;n.style.maxHeight=`${Math.max(0,Math.min(256,L?E:v))}px`,n.style.top=`${L?Math.max(4,u.top-n.offsetHeight):u.bottom}px`,r.setAttribute("aria-expanded","true");let w=[...n.children].filter(b=>!b.disabled);(w.find(b=>b.dataset.value===t.value)||(i?w.at(-1):w[0]))?.focus()};r.addEventListener("click",i=>{i.preventDefault(),n.hidden?h():p()}),c.addEventListener("keydown",i=>{if(i.key==="Escape"&&!n.hidden)i.preventDefault(),i.stopPropagation(),p(!0);else if(i.key==="Tab")p(!0);else if(["ArrowDown","ArrowUp","Home","End"].includes(i.key)){if(i.preventDefault(),n.hidden)return h(i.key==="ArrowUp"||i.key==="End");let u=[...n.children].filter(v=>!v.disabled),g=u.indexOf(document.activeElement),y=i.key==="Home"?0:i.key==="End"?u.length-1:(g+(i.key==="ArrowDown"?1:-1)+u.length)%u.length;u[y]?.focus()}}),document.addEventListener("pointerdown",i=>{c.contains(i.target)||p()}),c.addEventListener("focusout",i=>{c.contains(i.relatedTarget)||p()}),window.addEventListener("resize",()=>p()),document.addEventListener("scroll",i=>{n.contains(i.target)||p()},!0),t.addEventListener("change",f),new MutationObserver(f).observe(t,{childList:!0,subtree:!0,attributes:!0}),t.closest("dialog")?.addEventListener("close",()=>p()),o.push(f),f()}return()=>o.forEach(t=>t())}function F(){let a=document.querySelector("#fabric-designer");q(),a.querySelector("form").dispatchEvent(new Event("input")),a.open||a.showModal()}var M=!1;function q(){if(M)return;M=!0;let a=document.querySelector("#fabric-designer"),e=a.querySelector("form");$(e.querySelectorAll("select"));let o=e.querySelector("[type=submit]"),s=e.querySelector("[role=alert]"),t=()=>({superspines:e.elements.superspines.value,spines:e.elements.spines.value,leaves:e.elements.leaves.value,igp:e.elements.igp.value,overlay:e.elements.overlay.value,clientsPerLeaf:e.elements.clientsPerLeaf.value,clientMultihoming:e.elements.clientMultihoming.value!=="single",clientBonding:e.elements.clientMultihoming.value==="bond",dualLoopback:e.elements.dualLoopback.checked,srv6Static:e.elements.srv6Static.checked,srv6Usid:e.elements.srv6Usid.checked});function c(){e.querySelector("#client-attachment-help").textContent={single:"One link to a leaf.",ecmp:"Equal-cost routed uplinks to a leaf pair.",bond:"Active-backup bond; one IP on bond0."}[e.elements.clientMultihoming.value];let r=e.elements.overlay.value==="srv6",l=e.elements.overlay.value!=="none";e.elements.dualLoopback.disabled=!l,l||(e.elements.dualLoopback.checked=!1),e.querySelector("#fabric-srv6-options").hidden=!r,e.elements.srv6Static.disabled=!r,e.elements.srv6Usid.disabled=!r;try{let d=k(t()),n=d.superspines+d.spines+d.leaves,p=d.leaves*d.clientsPerLeaf,f=d.spines*(d.superspines+d.leaves)+p*(d.clientMultihoming?2:1),h={none:"",vxlan:" + VXLAN + EVPN",srv6:" + SRv6"}[d.overlay]??"";e.querySelector("output").textContent=`${n} routers \xB7 ${p} clients \xB7 ${f} links \xB7 ${d.igp.toUpperCase()}${h}`,s.textContent="",o.disabled=!1}catch(d){s.textContent=d.message,o.disabled=!0}}e.querySelector("[data-close]").addEventListener("click",()=>a.close()),e.addEventListener("input",c),e.addEventListener("submit",async r=>{r.preventDefault(),o.disabled=!0,s.textContent="";try{let l=await S(t(),window.location.href);l.pathname===window.location.pathname&&l.search===window.location.search?(window.history.replaceState(null,"",l),window.location.reload()):window.location.assign(l.href)}catch(l){s.textContent=l.message,o.disabled=!1}})}export{F as openFabricDesigner};
