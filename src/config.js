// Cargar variables de entorno ANTES que cualquier otro módulo
import dotenv from 'dotenv';
dotenv.config();

// Exportar configuración para uso en la app
export const config = {
  port: process.env.PORT || 4000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '24h',
  nodeEnv: process.env.NODE_ENV || 'development'
};

// Validar que las variables críticas estén definidas
if (!config.mongodbUri) {
  console.error('❌ ERROR FATAL: MONGODB_URI no está definida en el archivo .env');
  process.exit(1);
}

if (!config.jwtSecret) {
  console.error('❌ ERROR FATAL: JWT_SECRET no está definida en el archivo .env');
  process.exit(1);
}
