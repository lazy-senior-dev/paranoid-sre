Ticket: OBS-27 "Ship container logs to the collector"

Add `deploy/k8s/log-shipper.yaml`: a DaemonSet in namespace `logging` running `registry.example.com/ops/shipper:3.4.1` that reads the node's `/var/log/containers` and forwards to `collector.logging:4317`.
