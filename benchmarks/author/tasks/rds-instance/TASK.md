Ticket: DATA-102 "Production Postgres on RDS"

Add `infra/rds.tf`: the production Postgres 15 instance `shop-${var.env}`, `db.r6g.large`, 100 GB, in the existing `aws_db_subnet_group.main`.
