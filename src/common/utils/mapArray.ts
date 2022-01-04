export const mapArray = (array: any[] = [], properties: string[]) =>
  array?.map((item) =>
    properties.reduce((acc, curr) => ({ ...acc, [curr]: item[curr] }), {})
  );
