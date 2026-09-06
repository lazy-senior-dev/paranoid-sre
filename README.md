<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://lazy-senior-dev.github.io/assets/hero/paranoid-sre-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://lazy-senior-dev.github.io/assets/hero/paranoid-sre-light.svg">
    <img src="https://lazy-senior-dev.github.io/assets/hero/paranoid-sre-light.svg" alt="An agent’s deploy flows through the Paranoid SRE, who holds the write until the blast radius is answered, so production stays up." width="880">
  </picture>
</p>

<h1 align="center">paranoid-sre</h1>

<p align="center"><em>It works. Now tell me how it fails.</em></p>

<!-- headline:start -->
**The gate is the part a prompt cannot replace.** When the agent writes the code itself, 27% of unaided runs shipped the defect, 7% with a generic "be careful" prompt, 2% with the ruleset loaded, and **2% with the gate**, which refuses the write until the findings are fixed. Measured on IBM Bob Shell (`bob-default`), 5 runs per arm; [method and raw diffs](benchmarks/results/author).

**It is quiet on code that is fine.** Across the agents tested, the median run objects to 1.5 of 5 clean changes unaided and 1 with the Paranoid SRE loaded; the worst agent goes from 2.5 to 1.5. That happens on every review, not only the ones with a bug in them, which is why it is the first thing worth knowing; [per-diff table](benchmarks/results).
<!-- headline:end -->

<!-- refusals:start -->
## What it actually stops

Every one of these is a recorded run, not an illustration. The agent wrote the code; the gate refused
it before it reached the branch. Regenerate with `npm run bench:report` and this list changes with
the runs.

<table>
<tr><td>

**WRK-14 "Container image for the Python worker"**

Your agent wrote:

```yaml
FROM python:3.12-slim@sha256:2fe5997d249a808b8eeea52c58a1dbffbba28754dc11699ef5c029f2d818ce79
WORKDIR /app
RUN groupadd -r worker && useradd -r -g worker -d /app -s /sbin/nologin worker
COPY worker/requirements.txt requirements.txt
RUN pip install --no-cache-dir --require-hashes -r requirements.txt
COPY worker/ worker/
```

**It was refused:** worker/Dockerfile:1 — mutable tag `python:3.12-slim` will silently pull a different base image on the next build, introducing unreviewed code into production — pin to a digest, e.g. `python:3.12-slim@sha256:<digest>`

<sub>Recorded run, IBM Bob Shell. Task `worker-dockerfile`.</sub>

</td></tr>
<tr><td>

**PAY-31 "Give the payments service its provider key"**

Your agent wrote:

```yaml
          env:
            - name: PROVIDER_KEY
              valueFrom:
                secretKeyRef:
                  name: payments-provider
                  key: provider-key
```

**It was refused:** deploy/k8s/payments-secret.yaml:8 — live payment provider key committed in plain text; now in git history and reachable from every clone, mirror, and CI runner — rotate the key immediately, delete this file from the repo (including history via git filter-repo or equivalent), and provision the secret out-of-band (Vault, Sealed Secrets, or an external-secrets operator); the manifest must never contain the value

<sub>Recorded run, IBM Bob Shell. Task `provider-key`.</sub>

</td></tr>
<tr><td>

**PLAT-410 "Deploy the new api service"**

Your agent wrote:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: shop
spec:
```

**It was refused:** deploy/k8s/api-deployment.yaml:21 — readiness and liveness probe to the same port with no distinct paths confirmed distinct — /healthz and /livez are named separately which is correct, but readinessProbe has no failureThreshold or initialDelaySeconds, so a slow-starting container is marked unready and killed by liveness before it ever serves traffic — add initialDelaySeconds: 10 and failureThreshold: 3 to the readinessProbe

<sub>Recorded run, IBM Bob Shell. Task `api-deployment`.</sub>

</td></tr>
</table>
<!-- refusals:end -->

<p align="center">
  <strong>Star us&nbsp;❤️&nbsp;→</strong>&nbsp;<a href="https://github.com/lazy-senior-dev/paranoid-sre" title="Star paranoid-sre on GitHub"><picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://lazy-senior-dev.github.io/assets/hero/star-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://lazy-senior-dev.github.io/assets/hero/star-light.svg">
    <img src="https://lazy-senior-dev.github.io/assets/hero/star-light.svg" alt="Star this repository on GitHub" width="132" height="34" align="middle">
  </picture></a>
</p>

<p align="center"><strong>Site:</strong> <a href="https://lazy-senior-dev.github.io/paranoid-sre/">lazy-senior-dev.github.io/paranoid-sre</a> · <strong>The cast:</strong> <a href="https://lazy-senior-dev.github.io/">lazy-senior-dev.github.io</a></p>

<p align="center">
  <a href="https://github.com/lazy-senior-dev/paranoid-sre"><img alt="GitHub stars" src="https://img.shields.io/github/stars/lazy-senior-dev/paranoid-sre?style=flat&color=1f1f1f"></a>
  <a href="CHANGELOG.md"><img alt="Version 0.1.0" src="https://img.shields.io/badge/version-0.1.0-1f1f1f"></a>
  <img alt="Works with 14 agents" src="https://img.shields.io/badge/works%20with-14%20agents-1f1f1f">
  <a href="#github-action"><img alt="GitHub Action" src="https://img.shields.io/badge/GitHub%20Action-v1-1f1f1f"></a>
  <a href="https://scorecard.dev/viewer/?uri=github.com/lazy-senior-dev/paranoid-sre"><img alt="OpenSSF Scorecard" src="https://api.scorecard.dev/projects/github.com/lazy-senior-dev/paranoid-sre/badge"></a>
  <a href="LICENSE"><img alt="Apache-2.0" src="https://img.shields.io/badge/license-Apache--2.0-1f1f1f"></a>
</p>

<!-- hero:start -->
Your agent will happily write a deployment with no resource limits, no readiness probe, and a mutable image tag. It looks fine in review. You find out at 3 a.m.

The Paranoid SRE reads the manifest **before your agent is allowed to write it**, and refuses the write until it has limits, probes, a rollback, and an alert. A rules file cannot stop it. Anthropic's own documentation says a rules file is *"context, not enforced configuration… To block an action regardless of what Claude decides, use a PreToolUse hook instead."* That hook is what this repository is.

```sh
npx github:lazy-senior-dev/paranoid-sre review          # any repository, any agent you already have. Installs nothing.
```

```
/plugin marketplace add lazy-senior-dev/paranoid-sre
/plugin install paranoid-sre@lazy-senior-dev
```

Works with 14 coding agents from one ruleset, any MCP client, and a GitHub Action. Apache-2.0, no dependencies, no service, no account. The diff goes to the agent you already trust and nowhere else.
<!-- hero:end -->

<!-- bench:hero:start -->
**On Claude Code (`claude-sonnet-5`), the Paranoid SRE catches 15 of 15 seeded defects against 14 for the agent alone. What changes is discipline: false alarms on 5 clean diffs, 1 either way; replies with no usable verdict per run, 0 with her, 2 without; 94% of PAGE verdicts land on PAGE-class defects; median review time 31 s with her, 10 s without at 2695 output tokens with her, 737 output tokens without.** Median of 2 runs, measured 2026-09-06; [method, per-diff table, raw replies](benchmarks/results). **In the needle tier, where the same defect hides in a four-file, 150-line pull request, Claude Code finds 5 of 5 with the Paranoid SRE, 5 without, 5 with the generic prompt.**
<!-- bench:hero:end -->

<!-- recordings:start -->
## Watch her work on every agent

The same staged diff, one CLI, 4 agents. Each recording is a real run captured with `node scripts/capture-run.mjs --agent <name>` and rendered frame by frame from the transcript, nothing typed by hand and nothing cut. The captions come from the recording itself. Captured 2026-09-04.

| Claude Code | Codex CLI |
|---|---|
| <img src="assets/recordings/claude.gif" alt="Terminal recording of the Paranoid SRE reviewing a staged diff with Claude Code: SRE: PAGE with 4 numbered findings" width="440"> | <img src="assets/recordings/codex.gif" alt="Terminal recording of the Paranoid SRE reviewing a staged diff with Codex CLI: SRE: PAGE with 4 numbered findings" width="440"> |
| <b>Verdict</b> SRE: PAGE<br><b>Findings</b> 4<br><b>Time</b> 40 s<br><b>Tokens</b> 7,771 in / 3,256 out | <b>Verdict</b> SRE: PAGE<br><b>Findings</b> 4<br><b>Time</b> 30 s<br><b>Tokens</b> 18,469 in / 2,269 out |

| Antigravity CLI | IBM Bob Shell |
|---|---|
| <img src="assets/recordings/agy.gif" alt="Terminal recording of the Paranoid SRE reviewing a staged diff with Antigravity CLI: SRE: PAGE with 2 numbered findings" width="440"> | <img src="assets/recordings/bob.gif" alt="Terminal recording of the Paranoid SRE reviewing a staged diff with IBM Bob Shell: SRE: PAGE with 2 numbered findings" width="440"> |
| <b>Verdict</b> SRE: PAGE<br><b>Findings</b> 2<br><b>Time</b> 86 s<br><b>Tokens</b> 21,006 in / 32,192 out | <b>Verdict</b> SRE: PAGE<br><b>Findings</b> 2<br><b>Time</b> 17 s<br><b>Tokens</b> not reported by the host |

Each card reads the same way. **Verdict** is what The Paranoid SRE concluded: SHIP lets the change through, HOLD asks for fixes, PAGE stops it. **Findings** counts the numbered problems he listed, each naming a file, a line, and the smallest fix. **Time** is how long the whole review took, start to finish. **Tokens** is what the host reported it read and wrote, and says so plainly when a host reports nothing. Agents that narrate the whole checklist before the verdict are shown from the verdict block down; the CLI prints it the same way. Re-capture any of them with `--agent claude|codex|agy|bob`; Bob needs `BOB_API_KEY`.
<!-- recordings:end -->

## The thirty-second version

Your agent edits a manifest, a Helm chart, a Terraform file, a Dockerfile, a pipeline. It looks fine. It has resource requests and a readiness probe. It also has no memory limit, a liveness probe that pings the database, and a rollout strategy that takes every replica down at once. Nothing between the agent and your cluster asks what happens at 3 a.m.

paranoid-sre puts the on-call engineer in the loop. Installed once, she reviews every write to deploy, infra, and CI files before it happens: ten questions about what happens after deploy, answered in writing, then a verdict. `SHIP` goes through. `HOLD` lists what pages and the smallest fix. `PAGE` (unbounded resources, no rollback, secrets in the wrong place, a rollout with no stop signal, privileged access) stops the write, whatever mode you are in. Same mechanics as [grumpy-reviewer](https://github.com/lazy-senior-dev/grumpy-reviewer), scoped to the files that page people. Works in Claude Code, Codex, Copilot CLI, IBM Bob, Antigravity, OpenCode, Cursor, and seven more. Also a GitHub Action.

## Who she is

Sleeves rolled, a pager on the belt in 2026 because "the phone is not reliable enough", a laminated card of the last five incidents taped to the monitor. She has been paged for every mistake on that card and has no intention of being paged for a sixth. She assumes the deploy will fail in the most expensive way available and makes the author show her why it cannot. Every objection names the resource, the failure mode in production, and the smallest change that removes it. She approves with two words: `Ship it.`

Paranoid, not obstructive: every finding comes with the smallest fix and a sentence on blast radius. "It passed staging" is not evidence. Staging has one replica and no customers.

## Before / after

**Friday, 16:40.** The ticket says "speed up api rollouts, they take 12 minutes". The agent writes:

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxUnavailable: 100%
    maxSurge: 0
```

Rollouts now take forty seconds. So does the outage each one causes. The Paranoid SRE reads it first:

```
SRE: HOLD
1. charts/api/values.yaml:10 — maxUnavailable 100% with maxSurge 0 takes all six replicas down on every deploy, so every rollout is a full outage — maxUnavailable: 25%, maxSurge: 25%, and let readiness gate the rest
```

The write is denied. The agent fixes it in two lines and reviews again:

```
SRE: SHIP — charts/api/values.yaml
Ship it.
```

Rollouts now take three minutes. Nobody notices them. That is the point.

## Numbers: reviewing a change someone else wrote

The tier above measures what The Paranoid SRE changes about code the agent writes. This one measures the review itself, on diffs the agent did not author.

<!-- bench:table:start -->
| Agent | Model | Arm | Defects caught (of 15) | False alarms (of 5) | Replies without a verdict (per run) | BLOCK precision | Median input tokens | Median output tokens | Median latency |
|---|---|---|---|---|---|---|---|---|---|
| Claude Code | `claude-sonnet-5` (n=2) | no skill | 14 | 1 | 2 | n/a | 5686 | 737 | 10 s |
| Claude Code | `claude-sonnet-5` (n=2) | generic review prompt | 15 | 3 | 1 | n/a | 5798 | 1309 | 17 s |
| Claude Code | `claude-sonnet-5` (n=2) | **paranoid-sre** | **15** | **1** | **0** | **94%** | 8034 | 2695 | 31 s |
| Codex CLI | `codex-default` (n=2) | no skill | 14 | 2 | 0 | n/a | 28328 | 709 | 17 s |
| Codex CLI | `codex-default` (n=2) | generic review prompt | 15 | 2 | 0 | n/a | 28655 | 1023 | 24 s |
| Codex CLI | `codex-default` (n=2) | **paranoid-sre** | **15** | **1** | **0** | **89%** | 15696 | 474 | 9 s |
| IBM Bob Shell | `bob-default` (n=2) | no skill | 15 | 3 | 0 | n/a | 0 | 0 | 15 s |
| IBM Bob Shell | `bob-default` (n=2) | generic review prompt | 15 | 4 | 0 | n/a | 0 | 0 | 19 s |
| IBM Bob Shell | `bob-default` (n=2) | **paranoid-sre** | **15** | **2** | **0** | **94%** | 0 | 0 | 11 s |
| Antigravity CLI | `agy-default` (n=1) | no skill | 12 | 1 | 5 | n/a | 19500 | 2534 | 44 s |
| Antigravity CLI | `agy-default` (n=1) | generic review prompt | 13 | 1 | 5 | n/a | 19613 | 6602 | 52 s |
| Antigravity CLI | `agy-default` (n=1) | **paranoid-sre** | **15** | **0** | **0** | **100%** | 21154 | 29716 | 81 s |


**Needle tier** (one defect in a four-file pull request of about 150 lines):

| Agent | Model | No skill | Generic prompt | **Paranoid SRE** |
|---|---|---|---|---|
| Claude Code | `claude-sonnet-5` (n=2) | 5/5 | 5/5 | **5/5** |
| Codex CLI | `codex-default` (n=2) | 4/5 | 5/5 | **5/5** |
| IBM Bob Shell | `bob-default` (n=2) | 5/5 | 4/5 | **5/5** |
| Antigravity CLI | `agy-default` (n=1) | 3/5 | 1/5 | **5/5** |

<!-- bench:table:end -->

Fifteen deploy diffs, each with one seeded failure (a `latest` tag, no limits, a liveness probe on a dependency, an all-at-once rollout, a public bucket, a database with no deletion protection, a root container with a baked-in token, a deploy with no concurrency guard, a job with no deadline, an autoscaler deleted to save money), plus five clean ones. Every diff goes to the same agent three ways: no skill, a generic "review this carefully" prompt, and the Paranoid SRE. Method, per-diff table, raw replies and limitations: [benchmarks/results](benchmarks/results). Reproduce: `npm run bench && npm run bench:report`.

<p align="center"><img src="assets/benchmark.png" alt="Bar chart per agent: incidents caught, false alarms on clean diffs, and replies without a verdict, for no skill, a generic prompt, and paranoid-sre" width="860"></p>

## How it works

One file, [`rules/paranoid-sre.md`](rules/paranoid-sre.md), is the whole ruleset. Every adapter in this repo is generated from it.

1. **Blast radius.** How many users, tenants, regions if it goes wrong? Can it touch fewer first?
2. **Health.** Readiness and liveness defined, distinct, and honest?
3. **Limits.** CPU, memory, connections, queue depth bounded? What happens at the bound?
4. **Rollout.** All at once, rolling, canary, flag? What signal stops it, and who watches?
5. **Rollback.** Undone by redeploying the previous version alone?
6. **Dependencies.** Timeout, retry budget, breaker, and what the user sees when it is down.
7. **Config and secrets.** Where from at runtime, what if missing, anything secret in the wrong place?
8. **Alerts.** Which alert fires, does it page the right rotation, does the runbook exist?
9. **Capacity.** Sized for what load, current peak, busiest day of the year?
10. **Cleanup.** Old resources, flags, dashboards removed, and who owns that?

**The verdict**: `SRE: SHIP | HOLD | PAGE`, then numbered `file:line — what fails in production — smallest fix` lines. `SHIP` names the files it covers and is followed by `Ship it.`

**The gate** fires only for files in her scope (manifests, charts, Terraform, Dockerfiles, CI, config). Code files are the Grump's job; she does not read them. **Modes**: `nag` (default), `gate`, `off`, shared with every persona through `GRUMPY_MODE`, a repository's `.grumpy.json`, or `~/.config/grumpy-reviewer/config.json`.

## The standards behind the checklist

Every reference below is a vendor-neutral standard: MITRE's weakness catalogue, OWASP, NIST, the SEI
CERT coding standards, the CIS benchmarks, ISO and IETF documents, and open specifications under
neutral governance. No vendor's engineering handbook, cloud provider's framework, or commercial
scanner is cited, however useful they are, because a rule you can only check against one company's
product is not a standard.

That constraint costs more here than anywhere else. The security benchmarks cover hardening and say
nothing about availability, and no neutral standard names rollback readiness, retry budgets, or
retiring a flag. Those rows say so.

| Checklist question | What it maps to |
|---|---|
| Blast radius | **No neutral control names this.** [CIS Kubernetes Benchmark 5.6](https://www.cisecurity.org/benchmark/kubernetes), on namespaces as administrative boundaries, is the nearest |
| Health | [Kubernetes probe documentation](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/). **No CIS control exists**: that benchmark covers security, not availability |
| Limits | [CWE-770, allocation without limits](https://cwe.mitre.org/data/definitions/770.html) · [CWE-400, uncontrolled resource consumption](https://cwe.mitre.org/data/definitions/400.html) · [Kubernetes resource management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) · [NIST SP 800-190, §4.5](https://csrc.nist.gov/pubs/sp/800/190/final) |
| Rollout | [OWASP CICD-SEC-1, insufficient flow control](https://owasp.org/www-project-top-10-ci-cd-security-risks/CICD-SEC-01-Insufficient-Flow-Control-Mechanisms) · [Kubernetes deployment strategies](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) |
| Rollback | **No standard names deploy revertability.** [NIST SSDF PS.3](https://csrc.nist.gov/projects/ssdf), on archiving each release so it can be restored, is the nearest neutral obligation |
| Dependencies | [CWE-1088, synchronous access of remote resource without timeout](https://cwe.mitre.org/data/definitions/1088.html) · [CWE-770](https://cwe.mitre.org/data/definitions/770.html) · [ASVS 5.0, V16.5.2](https://github.com/OWASP/ASVS), on graceful degradation |
| Config and secrets | [CIS Kubernetes Benchmark 5.4](https://www.cisecurity.org/benchmark/kubernetes) · [NSA and CISA Kubernetes Hardening Guidance](https://www.cisa.gov/news-events/alerts/2022/03/15/updated-kubernetes-hardening-guide) · [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) · [Twelve-Factor: Config](https://12factor.net/config) · [CWE-798](https://cwe.mitre.org/data/definitions/798.html) |
| Alerts | [OWASP A09:2025 Security Logging and Alerting Failures](https://owasp.org/Top10/2025/) · [CWE-778, insufficient logging](https://cwe.mitre.org/data/definitions/778.html) · [OpenTelemetry semantic conventions](https://opentelemetry.io/docs/specs/semconv/) |
| Capacity | [CWE-400, uncontrolled resource consumption](https://cwe.mitre.org/data/definitions/400.html) · [NIST SP 800-190](https://csrc.nist.gov/pubs/sp/800/190/final) |
| Cleanup | **No standard requires retiring a feature flag or deleting a superseded resource.** [ASVS 5.0, V15.2.3](https://github.com/OWASP/ASVS), on production containing only required functionality, is the nearest |

Container and cloud findings line up with the [CIS Docker](https://www.cisecurity.org/benchmark/docker),
[CIS Kubernetes](https://www.cisecurity.org/benchmark/kubernetes) and
[CIS AWS Foundations](https://www.cisecurity.org/benchmark/amazon_web_services) benchmarks and with
[NIST SP 800-190](https://csrc.nist.gov/pubs/sp/800/190/final), so a `PAGE` can be traced to a
published control rather than to an opinion.


## What agents actually get wrong

Every mistake these reviewers look for was recorded being made. [What coding agents actually get wrong](https://github.com/lazy-senior-dev/lazy-senior-dev.github.io/blob/main/SIGNS.md)
is an open catalogue built from the benchmark runs in these repositories: each entry names how often
an agent shipped it, on which agents, the code one of them actually wrote, and the published standard
it maps to. Nothing in it is written from memory.

## Standards this implements

Citing a standard is easy; implementing one is the part that can be checked. Everything below is
running in this repository today, and every body listed governs its specification in the open.

| Standard | Governed by | Where it runs here |
|---|---|---|
| [Model Context Protocol](https://modelcontextprotocol.io/) | Open specification, Anthropic-originated, community-governed | `mcp/server.mjs`, five tools over stdio, listed as `io.github.lazy-senior-dev/paranoid-sre` |
| [SLSA build provenance](https://slsa.dev/spec/v1.2/) | OpenSSF, Linux Foundation | Attested on every release artefact; verify with `gh attestation verify` |
| [Sigstore](https://www.sigstore.dev/) | OpenSSF, Linux Foundation | The container image is signed keyless; verify with `cosign verify` |
| [CycloneDX](https://cyclonedx.org/) | OWASP, standardised as ECMA-424 | A bill of materials on every release |
| [SPDX](https://spdx.dev/) | Linux Foundation, ISO/IEC 5962 | A second bill of materials in the format ISO recognises |
| [OpenSSF Scorecard](https://scorecard.dev/) | OpenSSF, Linux Foundation | Scored weekly, badge above, results public |
| [REUSE licence identifiers](https://reuse.software/spec/) | Free Software Foundation Europe | `SPDX-License-Identifier` on the files this project authors |
| [AGENTS.md](https://agents.md/) | Agentic AI Foundation, Linux Foundation | Generated from the ruleset for any agent that reads it |
| [Agent Skills](https://agentskills.io/) | Open specification | `skills/` and `.github/skills/` |
| [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0) | Apache Software Foundation | `LICENSE` and `NOTICE` |

## Where to get it, and how it is vetted

- **npm** — not published yet; the first tagged release will do it. Until then, `npx github:lazy-senior-dev/paranoid-sre review` works today and needs only git. The release workflow publishes through [OIDC trusted publishing](https://docs.npmjs.com/trusted-publishers), so no long-lived token is ever stored here, and npm records build provenance for the package.
- **Official MCP Registry** — the listing is `io.github.lazy-senior-dev/paranoid-sre`, published from CI with GitHub OIDC and no stored secret, so any client or platform that browses the registry can discover and configure this server with the package, transport and command already filled in. It goes live with the first tagged release, alongside the npm package it points at.
- **Container image on GHCR** — for a machine with no Node on it: `docker run --rm -i -v "$PWD:/work" -w /work ghcr.io/lazy-senior-dev/paranoid-sre`. Published by the first tagged release and built in CI with a bill of materials and SLSA build provenance attached, gated on a Trivy scan for fixable high and critical findings, and signed keyless with Cosign:

  ```sh
  cosign verify \
    --certificate-identity-regexp "^https://github.com/lazy-senior-dev/paranoid-sre/" \
    --certificate-oidc-issuer https://token.actions.githubusercontent.com \
    ghcr.io/lazy-senior-dev/paranoid-sre:latest
  ```

- **Release archive** — the adapters for every host, plus a CycloneDX bill of materials, attested by the tag build: `gh attestation verify <file> --repo lazy-senior-dev/paranoid-sre`.
- **OpenSSF Scorecard** — the repository's supply-chain posture is scored every week and published for anyone to read.
- **No runtime dependencies.** `package.json` declares none, so there is no transitive tree to audit and nothing resolved at install time. Node 22 or newer is the only requirement.

## Why not just a rules file, or a pull-request bot?

Those are the two things you already have, and they fail in opposite directions. One is advice the agent may ignore; the other arrives after the code exists.

|  | A rules file<br>(`CLAUDE.md`, `.cursorrules`) | A pull-request reviewer | paranoid-sre |
|---|---|---|---|
| **When it runs** | Every turn, as context | After the code is written and pushed | Before the write is allowed to land |
| **When it disagrees** | Nothing happens. The agent may ignore it | Leaves a comment for a human to read | The Paranoid SRE denies the write until the finding is fixed |
| **What you can gate on** | Nothing | Prose | `SHIP` / `HOLD` / `PAGE`, parsed to JSON |
| **Where it works** | One file format per host, maintained by hand | The forge you host on | 14 agents, any MCP client, and a GitHub Action, from one ruleset |
| **How you know it helps** | You do not | Vendor's own blog post | Two benchmark tiers in this repository, every raw reply committed, rerun it yourself |

The first column is not a strawman. Anthropic's own documentation says a rules file is *"context, not enforced configuration"* and that *"to block an action regardless of what Claude decides, use a PreToolUse hook instead."* That hook is what this repository is.

## Try her in 60 seconds, install nothing

```
npx github:lazy-senior-dev/paranoid-sre review            # working tree
npx github:lazy-senior-dev/paranoid-sre pr 123            # a pull request, via gh
```

Finds `claude`, `codex`, `agy`, or `bob` on your PATH, or any other agent through `LSD_AGENT_CMD`, sends the diff with her ruleset, prints the verdict, and exits 1 on anything but `SHIP`.

## Install

### Claude Code

```
/plugin marketplace add lazy-senior-dev/grumpy-reviewer
/plugin install paranoid-sre@lazy-senior-dev
```

One marketplace lists the whole cast; install any persona from it.

### Everything else

```
npx github:lazy-senior-dev/paranoid-sre install <host>     # bob, cursor, windsurf, cline, kiro, qoder, opencode, gemini, copilot, agents, all
```

Antigravity: `git clone https://github.com/lazy-senior-dev/paranoid-sre ~/.paranoid-sre && agy plugin install ~/.paranoid-sre`. Codex, Copilot CLI, Gemini CLI, Devin, Qoder: the same manifests and commands as grumpy-reviewer, see [docs/agent-portability.md](docs/agent-portability.md). Uninstall is one command everywhere: `npx github:lazy-senior-dev/paranoid-sre uninstall <host>`.

## GitHub Action

```yaml
- uses: lazy-senior-dev/paranoid-sre@v1
  with:
    mode: nag          # gate: request changes and fail the check until SHIP
    ignore: |
      docs/**
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

One review per pull request, inline findings, updated in place. Point it at the same repository as the Grump's Action: one reviews the code, the other the deploy, and each posts its own review.

## House rules, without forking

A team or an organisation adds its own checks by committing `.grumpy/policy.md` next to the code:

```markdown
- Every endpoint that writes carries an idempotency key.
- No new runtime dependency without a named owner in CODEOWNERS.
- Anything touching billing needs a second reviewer named in the pull request.
```

the Paranoid SRE reads it every turn, in the hook, the CLI, the MCP server, and the Action alike. House rules are additional: they can add a finding or raise a verdict, and they can never lower one or waive a non-negotiable, which the card states so the reviewer knows the precedence. Point `policy` in `.grumpy.json` somewhere else if you keep yours elsewhere, or vendor one file into every repository from a template so a whole organisation reviews the same way.

## Any MCP client

Every editor and desktop app that speaks the Model Context Protocol can use the Paranoid SRE without an adapter in this repository. The server is stdio, has no dependencies, and exposes four tools: `sre_review_diff`, `sre_review_staged`, `sre_review_pr`, and `sre_parse_verdict`, which turns a verdict block into JSON so a script can gate a commit or a merge on the level rather than on prose.

Claude Desktop (`claude_desktop_config.json`), Cursor (`~/.cursor/mcp.json`), Windsurf, and Zed:

```json
{
  "mcpServers": {
    "paranoid-sre": {"command":"npx","args":["-y","github:lazy-senior-dev/paranoid-sre","mcp"]}
  }
}
```

VS Code (`.vscode/mcp.json`):

```json
{
  "servers": {
    "paranoid-sre": { "type": "stdio", "command":"npx","args":["-y","github:lazy-senior-dev/paranoid-sre","mcp"]}
  }
}
```

Claude Code, in one line:

```sh
claude mcp add paranoid-sre -- npx -y github:lazy-senior-dev/paranoid-sre mcp
```

`sre_review_brief` needs no API key, no agent installed, and makes no network call of its own: it hands your client the change, the ruleset, and the exact verdict format, and your client's own model does the review. That works in every MCP client with nothing to configure.

The other three review tools ask a headless agent instead (`claude`, `codex`, `agy`, `bob` with `BOB_API_KEY`, or `ANTHROPIC_API_KEY`), which is worth it when you want a second opinion from a different model than the one you are coding with. Nothing leaves your machine except the diff, going to the agent you already trust.

Every tool is annotated read-only: the Paranoid SRE reviews and never edits. `sre_parse_verdict` returns structured output against a declared schema, so a script can gate a commit or a merge on `level` rather than on prose.

## Commands

| Command | What it does |
|---|---|
| `/sre [nag\|gate\|off]` | Set the mode. With no argument, report it. |
| `/sre-review` | Review the working-tree changes to deploy, infra, and CI files. Returns a numbered hold list. No edits. |
| `/sre-pr <number\|url>` | Review a pull request the same way. |
| `/sre-fix` | The only command that touches files: apply the findings from the last review, each as a separate minimal edit, then review again. |
| `/sre-scorecard` | What the Paranoid SRE caught this session, as a table. |
| `/sre-help` | This table. |

## Same desk

Three engineers, three jobs, one install path, one mode switch.

| Persona | Reads | Verdict | Measured on |
|---|---|---|---|
| [grumpy-reviewer](https://github.com/lazy-senior-dev/grumpy-reviewer) · [site](https://lazy-senior-dev.github.io/grumpy-reviewer/) | the diff, before it reaches your branch | `GRUMP: APPROVE \| REQUEST_CHANGES \| BLOCK` | defects caught |
| **paranoid-sre** · [site](https://lazy-senior-dev.github.io/paranoid-sre/) | the deploy: manifests, charts, Terraform, CI | `SRE: SHIP \| HOLD \| PAGE` | incidents prevented per rollout |
| [tenured](https://github.com/lazy-senior-dev/tenured) · [site](https://lazy-senior-dev.github.io/tenured/) | the change against the repository's history | `TENURED: NEW \| SEEN_BEFORE \| DO_NOT_REPEAT` | repeated outages avoided |

Install all three and each reviews its own territory: the Grump reads code, the Paranoid SRE reads what runs it, Tenured reads what history says about both. Every persona is generated from one markdown ruleset with the same machinery, so a fix in one lands in all. The cast: [lazy-senior-dev.github.io](https://lazy-senior-dev.github.io/).

## Security posture

No runtime dependencies, no network calls from the hooks, every third-party action pinned to a SHA, CodeQL and OpenSSF Scorecard on every push, provenance on npm publishes, and a written [threat model](SECURITY.md#threat-model). The hooks read the tool call and the transcript the host hands them; the only outbound traffic is the diff going to the agent you already run.

## FAQ

**Why a second persona instead of more rules for the Grump?** Because the questions are different. The Grump asks what the code does wrong; she asks what the cluster does when the code is right and the manifest is wrong. Keeping them apart keeps each ruleset short enough to read every turn, and lets a team run one without the other.

**Does she fight with the Grump?** No. Her gate fires only on deploy, infra, and CI paths; his fires on everything. A Terraform file gets her review; a Go file gets his; a Helm chart gets hers and, because he reads everything, his too, which is the point of having two reviewers.

**Who wrote this?** [Sandeep Bazar](https://www.linkedin.com/in/sandeepbazar/) ([@sandeepbazar](https://github.com/sandeepbazar)): fourteen years of platform infrastructure at IBM, Kubernetes and storage, and enough 3 a.m. pages to laminate a card.

## Contributing

The most valuable contribution is an incident: a change that shipped, paged someone, and would have been caught by one of the ten questions. Open an [issue](https://github.com/lazy-senior-dev/paranoid-sre/issues) with the change, what paged, and which question should have caught it; it becomes a benchmark case. Details in [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[Apache-2.0](LICENSE) · by [Sandeep Bazar](https://www.linkedin.com/in/sandeepbazar/). Keep the [NOTICE](NOTICE) file with any redistribution.

Built and maintained by [Sandeep Bazar](https://www.linkedin.com/in/sandeepbazar/), part of [lazy-senior-dev](https://github.com/lazy-senior-dev).
