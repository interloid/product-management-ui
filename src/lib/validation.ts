export const validateEmail = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Please enter your email address.";
  }
  if (trimmed.length > 254) {
    return "Email must be 254 characters or fewer.";
  }
  if (/\s/.test(trimmed)) {
    return "Email address cannot contain spaces.";
  }
  if (!trimmed.includes("@")) {
    return "Email address must contain an @ symbol.";
  }
  const emailRegex =
    /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

  if (!emailRegex.test(trimmed)) {
    return "Please enter a valid email address.";
  }
  return null;
};
