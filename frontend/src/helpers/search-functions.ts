
export const filterSearchQuery = <T>(
  query: string,
  data: T[],
  keywords: (keyof T)[]
) => {
  let filteredList: T[] = [];
  if (data) {
    filteredList = data.filter((item: T) =>
      keywords.some(
        (prop) =>
          item[prop]?.toString().toLowerCase().includes(query.toLowerCase())
      )
    );
  }

  return filteredList;
};

