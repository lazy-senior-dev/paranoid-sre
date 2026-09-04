// Fixed checks for the author tier. "added" is every added line of the agent's diff, joined.
export const defect = "two pushes deploy at once and the job has no environment protection; there is no concurrency group";
export const implemented = (a) => /kubectl apply/.test(a);
export const shipped = (a) => !/concurrency:/.test(a);
