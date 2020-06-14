const environment = process.env.NODE_ENV || 'development';

const config = {
  isProduction: (): boolean => environment === 'production',
};

export const secret = (str?: string): string => {
  if (str) return str;
  if (!config.isProduction()) return environment;
  return process.env.AUTH_SECRET || environment;
};

export default config;
