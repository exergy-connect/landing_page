# Browser control-plane twin with native FRR

`lab.xp` in this directory is the bundled lab. Compile and deploy the matching
topology from the xForm checkout,
`examples/network_validation/labs/exergy-lab.net/browser-twin.xp`, with
network_validation/Containerlab. It creates:

| Device | Runs where | IPv4 link address | AS |
| --- | --- | --- | --- |
| `frr1` | Native FRR container | `10.1.0.0/31` | 65001 |
| `twin1` | Linux interfaces and dataplane in a container; control plane in the browser | `10.1.0.1/31` | 65002 |

Choose **Browser twin with native FRR** in exergy-lab.net. Loading it immediately opens
`ws://192.168.121.102:4242/twin1`, using the management pool and node ID from the
source topology. The dotted `frr1` card marks an external device: exergy-lab.net does
not create a simulated FRR process, originate its routes, or claim to show its
live forwarding tables. Click **Launch** to start the browser's `twin1` control
plane. Its BGP stream goes through the dataplane to `frr1:179`. Session establishment
and received routes depend on the real FRR peer.

Use a rebuilt exergy-lab.net image containing browser WebSocket authentication support.
The browser authenticates with the `lab-net` and `auth.<token>` subprotocols;
the dataplane still accepts Authorization headers from non-browser clients. The
example uses `lab-net-browser-connect`, matching the generated container config.

The browser must be able to reach the container's management address and port.
Containerlab does not publish this port on the Docker host automatically. When
using a forwarded port or proxy, override the host and port in the lab URL:

```text
?lab=browser-twin&topology.nodes.twin1.device.ws.host=127.0.0.1&topology.nodes.twin1.device.ws.port=4242
```

The container terminates TLS on its dataplane port, so a browser can open
`https://<host>:<port>/` directly. That page uses `wss://` on the same port.
Plain `ws://` remains available for non-browser clients. A connection failure
is shown in the status and event log; reload the
lab after correcting reachability. Reset stops BGP streams, and switching labs
closes the old WebSocket. Receiver/root mode is not a complete TCP transport yet;
this example uses a direct connection to `twin1`.
