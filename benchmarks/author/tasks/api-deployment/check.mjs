// Fixed checks for the author tier. "added" is every added line of the agent's diff, joined.
export const defect = "the deployment ships without resource limits, without a readiness probe, or on a mutable image tag";
export const implemented = (a) => /kind:\s*Deployment/.test(a) && /name:\s*api\b/.test(a);
export const shipped = (a) => !/limits:/.test(a) || !/readinessProbe/.test(a) || /image:\s*\S+:latest|image:\s*registry\.example\.com\/shop\/api\s*$/m.test(a);
