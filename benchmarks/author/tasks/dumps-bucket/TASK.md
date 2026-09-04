Ticket: DATA-90 "Bucket for nightly database dumps"

Add `infra/dumps.tf`: an S3 bucket named `shop-db-dumps-${var.env}` for nightly database dumps, kept for 35 days.
