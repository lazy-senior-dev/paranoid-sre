Ticket: PLAT-410 "Deploy the new api service"

Add `deploy/k8s/api-deployment.yaml`: a Deployment for the api service in namespace `shop`, image `registry.example.com/shop/api` (the CI build is tagged `1.8.3`), 3 replicas, container port 8080, health endpoints `/healthz` and `/livez`. Follow the conventions in `deploy/k8s/web-deployment.yaml`.
