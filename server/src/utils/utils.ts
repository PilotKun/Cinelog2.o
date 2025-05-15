export const sanitizeUsernameForTableName = (username: string): string => {
  // Replace non-alphanumeric characters with underscores
  // Convert to lowercase to ensure case-insensitivity for table names if the DB is case-sensitive
  return username.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
}; 