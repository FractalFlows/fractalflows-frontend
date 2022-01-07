export const formatDate = (date: string | number) => {
  const getDate = () => {
    if (isNaN(Number(date))) {
      return Date.parse(date);
    } else {
      return Number(date);
    }
  };

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(getDate());
};
