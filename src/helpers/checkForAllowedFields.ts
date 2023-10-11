import { ExtendedRequest } from '@interfaces/express';

export const checkForAllowedFields = (req: ExtendedRequest, allowedKeys: string[]) => {
  let onlyAllowedFields = true;
  allowedKeys.forEach((key) => {
    if (!allowedKeys.includes(req.body?.[key])) {
      onlyAllowedFields = false;
    }
  });

  return onlyAllowedFields;
};
