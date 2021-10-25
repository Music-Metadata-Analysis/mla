type translationStringType = {
  [index: string]: string | translationStringType;
};

const translationKeyLookup = (
  translationDotKey: string,
  content: translationStringType
): string | translationStringType => {
  const splitKeys = translationDotKey.split(".");
  if (splitKeys.length === 1) return content[translationDotKey];
  const firstKey = splitKeys.shift() as string;
  return translationKeyLookup(
    splitKeys.join("."),
    content[firstKey] as translationStringType
  );
};

export default translationKeyLookup;
