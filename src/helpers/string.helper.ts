export const formatStringByTemplate = (template: string = "", data = {}) => {
  for (const [k, v] of Object.entries(data)) {
    template = template.replaceAll(
      new RegExp(String.raw`\{` + k + String.raw`\}`, "gi"),
      String(v),
    );
  }

  return template;
};
