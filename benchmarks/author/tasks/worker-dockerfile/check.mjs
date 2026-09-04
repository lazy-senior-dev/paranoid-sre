// Fixed checks for the author tier. "added" is every added line of the agent's diff, joined.
export const defect = "the container runs as root or builds from an unpinned base image";
export const implemented = (a) => /^FROM\s/m.test(a);
export const shipped = (a) => !/^USER\s+\S+/m.test(a) || /^FROM\s+\S+:latest/m.test(a) || /^FROM\s+[^:@\s]+\s*$/m.test(a);
