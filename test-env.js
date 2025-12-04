// Test script para verificar que las variables de entorno se cargan
import dotenv from 'dotenv';

// Cargar variables de entorno
const result = dotenv.config();

console.log('==========================================');
console.log('🔍 Diagnóstico de Variables de Entorno');
console.log('==========================================');

if (result.error) {
  console.error('❌ Error al cargar .env:', result.error);
} else {
  console.log('✅ Archivo .env encontrado');
}

console.log('\n📋 Variables cargadas:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Definida' : '❌ Undefined');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Definida' : '❌ Undefined');
console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE);
console.log('NODE_ENV:', process.env.NODE_ENV);

console.log('\n📍 Directorio actual:', process.cwd());
console.log('==========================================');
