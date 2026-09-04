Ticket: CI-58 "Deploy main to production automatically"

Add `.github/workflows/deploy.yml`: on every push to `main`, after the existing tests, apply `deploy/k8s` to the production cluster with `kubectl apply -k deploy/k8s` using the `KUBECONFIG_PROD` secret.
