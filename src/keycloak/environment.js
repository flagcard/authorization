const enviroment = process.env.NODE_ENV || 'development';

const isProduction = () => enviroment === 'production';

module.exports = {
  isProduction,
};
