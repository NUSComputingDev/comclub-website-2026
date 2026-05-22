export interface Article {
  department: 'IR' | 'SD/SL';
  title: string;
  body: string;
  link: string;
  imgSrc: string;
  startDatetime: string;
  endDatetime: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidDateTime(value: string) {
  return !Number.isNaN(Date.parse(value));
}

function isArticle(value: unknown): value is Article {
  if (!isRecord(value)) {
    return false;
  }

  return (
    (value.department === 'IR' || value.department === 'SD/SL') &&
    typeof value.title === 'string' &&
    typeof value.body === 'string' &&
    typeof value.link === 'string' &&
    typeof value.imgSrc === 'string' &&
    typeof value.startDatetime === 'string' &&
    typeof value.endDatetime === 'string' &&
    isValidDateTime(value.startDatetime) &&
    isValidDateTime(value.endDatetime)
  );
}

export const parseArticles = (data: unknown): Record<string, Article> => {
  if (!isRecord(data)) {
    throw new Error('Invalid articles data.');
  }

  const parsedArticles: Record<string, Article> = {};

  for (const [key, value] of Object.entries(data)) {
    if (!isArticle(value)) {
      throw new Error(`Invalid article data for "${key}".`);
    }

    parsedArticles[key] = value;
  }

  return parsedArticles;
};
