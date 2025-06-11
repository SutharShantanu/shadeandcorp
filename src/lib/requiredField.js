export const isFieldRequired = (schema, fieldName) => {
  const shape =
    typeof schema.shape === "function" ? schema.shape() : schema.shape;

  const field = shape?.[fieldName];
  if (!field) return false;

  // If field is optional or has a default, it's not required
  const isOptional =
    typeof field.isOptional === "function" ? field.isOptional() : field._def?.typeName === "ZodOptional";
  const isDefault = !!field._def?.default;

  if (isOptional || isDefault) return false;

  // Otherwise, it's required
  return true;
};
