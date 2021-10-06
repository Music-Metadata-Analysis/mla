type translationStringType = Record<string, string>;
type translationNestedType = Record<string, Record<string, string>>;

const translationKeyLookup = (
  translationDotKey: string,
  content: translationStringType | translationNestedType
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
