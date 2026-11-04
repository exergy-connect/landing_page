# Routed IPv4 service over SRv6

This example uses ordinary IPv4 BGP unicast routes with SRv6 service SIDs:

```text
ha -- pe1 (FRR/VPP) -- rr1 (FRR route reflector) -- twin1 (exergy-lab.net) -- hb
```

Each host attaches to a separate routed access subnet. There is no tenant bridge,
EVPN address family, VPNv4/VPNv6 service, or tenant VRF. `srv6.bgp.ipv4: [ibgp]`
enables the IPv4 service; `srv6.l3vpn: false` intentionally disables L3VPN.
IPv6 iBGP carries both the locator routes and IPv4 service advertisements using
IPv6 next hops. Static routes bootstrap loopback reachability; their destinations
and next hops reference framework-allocated values.

Keep the configured address pools. The framework allocates every node, link,
and access-subnet address and the SRv6 locators. The browser derives its local
full End.DT4 SID from the allocated locator, advertises access prefixes from the
resolved `bgp.advertise` list, and consumes service SIDs received in BGP updates.
It programs learned IPv4 routes with `encap seg6` and local decapsulation into
Linux's main table (254). The native FRR/VPP side owns its own SID allocation.
The helper disables IPv4 reverse-path filtering globally and on its SRv6 VRF
device so Linux accepts decapsulated packets whose reverse route uses SRv6.
Access interfaces retain their individual reverse-path filtering settings.
Full End.DT4/End.DT46 and uDT4/uDT46 remote SIDs are accepted; SID transposition
is not supported.

## Build and compile

The exergy-lab.net image must include the current browser code and native SRv6 helper.
Build it using the framework's normal image tag, rather than introducing an
SRv6-specific image name:

```sh
# From the exergy-lab.net repository:
docker build -f go/Dockerfile --target runtime \
  --build-arg LABNET_GIT_COMMIT="$(git rev-parse HEAD)" \
  -t ghcr.io/exergy-connect/exergy-lab.net-go:latest .
```

Compile this file directly from the xForm repository. Substitute the absolute
path to your exergy-lab.net checkout:

```sh
npm run compile -- examples/network_validation/network-validation-fw.xpt \
  /absolute/path/to/exergy-lab.net/public/examples/srv6/lab.xp \
  --final clab.yml --target lab.address --auto-approve
```

Deploy the emitted Containerlab topology. The framework's emitted inventory and
port mappings identify twin1's WebSocket/UI URL; open that URL and keep its
controlling browser open. No second browser control plane is needed.

## Verify native forwarding

Use the allocated host addresses from the deployed topology, rather than fixed
addresses. On twin1, check:

```sh
ip -6 route show proto 189
ip -4 route show proto 189
```

The local SID must show `seg6local action End.DT4`; the remote access subnet must
show `encap seg6` with the SID learned from native BGP. Verify native FRR's BGP
IPv4 and IPv6 unicast tables and its SRv6 SID table. Then ping in both directions
between ha and hb. Closing the controlling browser must remove helper-owned
routes; reopening it must restore them after BGP establishes.

Set `SRV6_URL` to twin1's UI URL to run `smoke/srv6.spec.js`. Set
`SRV6_CONTAINER_PREFIX` if the container names have a Containerlab prefix.
The smoke test discovers host IPv4 addresses from their access interfaces.

The helper requires a Linux kernel with SRv6 End.DT4/VRF support and appropriate
container networking capabilities. No native deployment is performed by the
repository's unit tests.
