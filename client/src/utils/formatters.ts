export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Draft';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Draft';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const formatReadingTime = (minutes: number): string => {
  const mins = Math.max(1, Math.round(minutes));
  return `${mins} min read`;
};
