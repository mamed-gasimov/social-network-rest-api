export const checkForAllowedFields = (obj: Record<string, unknown>, allowedKeys: string[]) => {
  let onlyAllowedFields = true;
  allowedKeys.forEach((key) => {
    if (!allowedKeys.includes(obj?.[key] as string)) {
      onlyAllowedFields = false;
    }
  });

  return onlyAllowedFields;
};
