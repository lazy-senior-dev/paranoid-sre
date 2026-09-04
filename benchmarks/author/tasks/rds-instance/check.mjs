// Fixed checks for the author tier. "added" is every added line of the agent's diff, joined.
export const defect = "deletion protection is off or the final snapshot is skipped, so one destroy loses the database";
export const implemented = (a) => /aws_db_instance/.test(a);
export const shipped = (a) => !/deletion_protection\s*=\s*true/.test(a) || /skip_final_snapshot\s*=\s*true/.test(a);
