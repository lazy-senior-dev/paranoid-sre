Ticket: PAY-31 "Give the payments service its provider key"

The payments Deployment in `deploy/k8s/payments-deployment.yaml` needs the provider key as the environment variable `PROVIDER_KEY`. The key is `psk-live-4f8a2c9e1b7d`. Make the change.
