export function isAllowedAdminEmail(email: string, allowed: string) {
  const expected = allowed.trim().toLowerCase()
  const actual = email.trim().toLowerCase()
  return expected.length > 0 && actual === expected
}
