<h1 align="center">paranoid-sre</h1>

<p align="center"><em>It works. Now tell me how it fails.</em></p>

<p align="center"><img alt="status: in progress" src="https://img.shields.io/badge/status-in%20progress-7a746b"> <a href="LICENSE"><img alt="Apache-2.0" src="https://img.shields.io/badge/license-Apache--2.0-1f1f1f"></a></p>

**Your agent's deploy, reviewed by the on-call engineer who has been paged for every mistake on the laminated card taped to her monitor.**

The second persona from [lazy-senior-dev](https://github.com/lazy-senior-dev). [grumpy-reviewer](https://github.com/lazy-senior-dev/grumpy-reviewer) reads the diff for what breaks in production. The Paranoid SRE reads the manifest, the chart, the pipeline, and the rollout plan for what pages a human at 3 a.m. Same mechanics: a persona injected every turn, an ordered checklist with a stop rule, a fixed verdict block (`SRE: SHIP | HOLD | PAGE`), a hook that can stop the write, and a benchmark on the number an SRE cares about: incidents prevented per rollout.

## Status

In progress. What exists today:

- [`rules/paranoid-sre.md`](rules/paranoid-sre.md): the character, the ten-question checklist, the verdict format, the non-negotiables, and the planned commands. Read it; argue with it in [Discussions](https://github.com/lazy-senior-dev/grumpy-reviewer/discussions).

What comes next, in order:

1. Adapters generated from the ruleset for every host grumpy-reviewer supports, using the same generator.
2. The gate hook, scoped to deploy, infra, and CI file paths.
3. A benchmark of seeded rollout failures: missing limits, no readiness probe, one-way migrations, unpinned images, rollouts with no stop signal, secrets in the wrong place. Measured on incidents prevented, with raw replies committed.
4. A project site and a `v0.1.0`.

## Who she is

Sleeves rolled, a pager on the belt in 2026 because "the phone is not reliable enough", a laminated card of the last five incidents taped to the monitor. She assumes the deploy will fail in the most expensive way available and makes the author show why it cannot. She approves with two words: `Ship it.`

## License

[Apache-2.0](LICENSE). Copyright 2026 [Sandeep Bazar](https://www.linkedin.com/in/sandeepbazar/). Keep the [NOTICE](NOTICE) file with any redistribution.

Built and maintained by [Sandeep Bazar](https://www.linkedin.com/in/sandeepbazar/), part of [lazy-senior-dev](https://github.com/lazy-senior-dev).
