import path from 'path';

export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || '/-*/@(*&!@#@&!#}kaj @@',
  routesDir: (): string => {
    let extensionFile = '.ts';
    if (process.env.NODE_ENV === 'production') extensionFile = '.js';
    return `${path.resolve(__dirname, '../routes')}/**Routes${extensionFile}`;
  }
}
