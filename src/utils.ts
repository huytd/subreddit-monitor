export type Nullable<T> = T | null;
export type Errorable<T> = [Nullable<T>, Nullable<Error>];

/**
 * Sanitize the string for using as name, remove all
 * special characters.
 */
export const sanitizeString = (input: string): string => {
  const matched = input.match(/[a-zA-Z0-9_]/g);
  if (matched) {
    return matched.join("");
  }
  return "";
};

/**
 * Fetch HTML source of an URL
 */
export const getHTML = async (url: string): Promise<string> => {
  const res = await fetch(url);
  return await res.text();
};
