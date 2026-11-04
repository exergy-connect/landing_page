import { packetLabel, isPacketEvent } from './embed.js';

const lab = document.querySelector('lab-embed');
const session = lab.session;
const byId = id => document.getElementById(id);
let previous = '', previousRoutes = '', packetCount = 0;
const bgpSeen = new Set();
const log = message => {
  const item = document.createElement('li');
  item.textContent = `${(session.summary.time / 1000).toFixed(1)}s  ${message}`;
  const list = byId('events');
  if (!list.dataset.live) { list.replaceChildren(); list.dataset.live = 'true'; }
  list.prepend(item);
  while (list.children.length > 8) list.lastElementChild.remove();
};
function render(summary) {
  byId('simulation').textContent = `${summary.state} · ${(summary.time / 1000).toFixed(0)}s`;
  const states = summary.sessions.map(s => `${s.left} ↔ ${s.right}: ${s.state}`).join(', ');
  byId('peering').textContent = states || 'Not started';
  const routes = summary.nodes.filter(n => n.kind !== 'linux').map(n => `${n.id}: ${n.routes}`).join(' · ');
  byId('routes').textContent = routes || '—';
  byId('ping').disabled = !['running', 'paused'].includes(summary.state);
  if (summary.state === 'running' && byId('ping-result').textContent === 'Start the lab to test connectivity.') byId('ping-result').textContent = 'Ready to test client1 → client2.';
  if (states && states !== previous) log(states);
  if (routes && routes !== previousRoutes && summary.state === 'running') log(`Routing tables updated — ${routes}`);
  previous = states; previousRoutes = routes;
  if (summary.state === 'ready') {
    packetCount = 0; bgpSeen.clear();
    const exchange = byId('bgp-exchange');
    exchange.replaceChildren(); delete exchange.dataset.live;
    const hint = document.createElement('li'); hint.textContent = 'Start the lab to see OPEN, KEEPALIVE, and UPDATE messages.'; exchange.append(hint);
    byId('ping-result').textContent = 'Start the lab to test connectivity.';
  }
}
session.subscribe('summary', render);
session.subscribe('packet', event => {
  if (!isPacketEvent(event)) return;
  packetCount++;
  const label = packetLabel(event);
  const messageKey = `${event.from}/${event.to}/${event.bgpType}`;
  if (event.proto === 'BGP' && (!event.periodic || !bgpSeen.has(messageKey))) {
    bgpSeen.add(messageKey);
    const list = byId('bgp-exchange');
    if (!list.dataset.live) { list.replaceChildren(); list.dataset.live = 'true'; }
    const item = document.createElement('li');
    item.textContent = `${event.from} → ${event.to}`;
    const type = document.createElement('span'); type.textContent = label.replace(/^BGP /, '');
    item.append(type); list.append(item);
    while (list.children.length > 24) list.firstElementChild.remove();
  }
  log(`${event.from} → ${event.to} · ${label} · packet ${packetCount}`);
});
byId('ping').onclick = () => {
  try {
    const result = session.ping({node:'client1',target:'client2',count:1});
    byId('ping-result').textContent = result.ok ? 'Reply received from client2.' : 'No reply from client2. Check links and routes.';
    log(`client1 → client2: ${result.ok ? 'ping succeeded' : 'ping failed'}`);
  } catch (error) { byId('ping-result').textContent = error.message; }
};
render(session.summary);
