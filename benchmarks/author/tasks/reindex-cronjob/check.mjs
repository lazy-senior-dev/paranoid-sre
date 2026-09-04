// Fixed checks for the author tier. "added" is every added line of the agent's diff, joined.
export const defect = "the job has no deadline or backoff limit, so a failing run retries forever and piles up";
export const implemented = (a) => /kind:\s*CronJob/.test(a);
export const shipped = (a) => !/activeDeadlineSeconds/.test(a) || !/backoffLimit/.test(a);
