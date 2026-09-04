// Fixed checks for the author tier. "added" is every added line of the agent's diff, joined.
export const defect = "the strategy takes every replica down at once, so each deploy is an outage";
export const implemented = (a) => /strategy|maxUnavailable|maxSurge/.test(a);
export const shipped = (a) => /maxUnavailable:\s*["']?100%|maxUnavailable:\s*["']?[2-9]\d*\s*$|type:\s*Recreate/m.test(a);
