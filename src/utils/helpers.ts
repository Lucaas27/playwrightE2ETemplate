import { ILocatorContext } from '@/interfaces';
import { Fixtures } from '@playwright/test';

export const capitaliseFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const capitaliseAllWords = (str: string) =>
  str
    .split(' ')
    .map((word) => capitaliseFirstLetter(word))
    .join(' ');

export const timeStamp = () => new Date().toISOString().replace(/[:.]/g, '-');

export const combineFixtures = (...args: Fixtures[]) => {
  const combinedFixtures = args.reduce((acc, curr) => {
    return { ...acc, ...curr };
  }, {});

  return combinedFixtures;
};

export const formatLocator = (locator: string, { ...context }: ILocatorContext): string => {
  let formattedLocator = locator;
  for (const [key, value] of Object.entries(context)) {
    formattedLocator = formattedLocator.replace(`{${key}}`, value.toString());
  }

  return formattedLocator;
};
