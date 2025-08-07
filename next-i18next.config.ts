export const i18n = {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
};

export default {
    i18n,
    reloadOnPrerender: process.env.NODE_ENV === 'development',
};
