var k=0;function C(E){let f=document.createElement("style");f.textContent=`.capture-menu {
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
`,document.head.append(f);let h=[],x=()=>{};for(let n of E){if(!n.id)do n.id=`capture-select-${++k}`;while(document.getElementById(`${n.id}-trigger`));let a=document.createElement("span");a.className="capture-menu",n.before(a),a.append(n),n.hidden=!0;let o=document.createElement("button");o.type="button",o.className="capture-menu-trigger",o.setAttribute("aria-haspopup","listbox"),o.setAttribute("aria-expanded","false");let c=n.closest("label"),g=n.getAttribute("aria-label")||[...c?.childNodes||[]].filter(e=>e.nodeType===3).map(e=>e.textContent.trim()).join(" ").trim();c&&(c.htmlFor=`${n.id}-trigger`),o.id=`${n.id}-trigger`;let t=document.createElement("div");t.id=`${n.id}-menu`,t.className="capture-menu-options",t.setAttribute("popover","manual"),t.setAttribute("role","listbox"),t.setAttribute("aria-label",g),t.hidden=!0,o.setAttribute("aria-controls",t.id),a.append(o,t);let r=(e=!1)=>{t.hidePopover(),t.hidden=!0,o.setAttribute("aria-expanded","false"),e&&o.focus()},l=()=>{let e=n.selectedOptions[0]?.textContent||"Choose\u2026";o.textContent=`${e} \u25BE`,o.setAttribute("aria-label",`${g}: ${e}`),o.disabled=n.disabled,n.disabled&&r();for(let i of t.children)i.setAttribute("aria-selected",String(i.dataset.value===n.value))},v=(e=!1)=>{if(n.disabled)return;x(),x=r,t.replaceChildren();for(let s of n.options){let d=document.createElement("button");d.type="button",d.setAttribute("role","option"),d.tabIndex=-1,d.textContent=s.textContent,d.dataset.value=s.value,d.disabled=s.disabled,d.addEventListener("click",A=>{A.preventDefault(),n.value=s.value,n.dispatchEvent(new Event("input",{bubbles:!0})),n.dispatchEvent(new Event("change",{bubbles:!0})),l(),r(!0)}),t.append(d)}l(),t.hidden=!1;let i=o.getBoundingClientRect();t.style.minWidth=`${i.width}px`,t.style.maxHeight="16rem",t.showPopover();let p=t.offsetWidth,b=t.offsetHeight;t.style.left=`${Math.max(4,Math.min(i.left,innerWidth-p-4))}px`;let u=innerHeight-i.bottom-4,w=i.top-4,y=u<Math.min(b,160)&&w>u;t.style.maxHeight=`${Math.max(0,Math.min(256,y?w:u))}px`,t.style.top=`${y?Math.max(4,i.top-t.offsetHeight):i.bottom}px`,o.setAttribute("aria-expanded","true");let m=[...t.children].filter(s=>!s.disabled);(m.find(s=>s.dataset.value===n.value)||(e?m.at(-1):m[0]))?.focus()};o.addEventListener("click",e=>{e.preventDefault(),t.hidden?v():r()}),a.addEventListener("keydown",e=>{if(e.key==="Escape"&&!t.hidden)e.preventDefault(),e.stopPropagation(),r(!0);else if(e.key==="Tab")r(!0);else if(["ArrowDown","ArrowUp","Home","End"].includes(e.key)){if(e.preventDefault(),t.hidden)return v(e.key==="ArrowUp"||e.key==="End");let i=[...t.children].filter(u=>!u.disabled),p=i.indexOf(document.activeElement),b=e.key==="Home"?0:e.key==="End"?i.length-1:(p+(e.key==="ArrowDown"?1:-1)+i.length)%i.length;i[b]?.focus()}}),document.addEventListener("pointerdown",e=>{a.contains(e.target)||r()}),a.addEventListener("focusout",e=>{a.contains(e.relatedTarget)||r()}),window.addEventListener("resize",()=>r()),document.addEventListener("scroll",e=>{t.contains(e.target)||r()},!0),n.addEventListener("change",l),new MutationObserver(l).observe(n,{childList:!0,subtree:!0,attributes:!0}),n.closest("dialog")?.addEventListener("close",()=>r()),h.push(l),l()}return()=>h.forEach(n=>n())}export{C as enhanceCaptureMenus};
