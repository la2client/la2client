import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export type Locale = (typeof routing.locales)[number];
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
