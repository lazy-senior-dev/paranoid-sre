Ticket: SRCH-92 "Rebuild the search index nightly"

Add `deploy/k8s/reindex-cronjob.yaml`: a CronJob in namespace `search` that runs `registry.example.com/search/reindex:2.1.0` every night at 02:00 UTC. A run takes about twenty minutes.
