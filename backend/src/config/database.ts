// src/config/database.ts
import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('La variable de entorno MONGO_URI es obligatoria');
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('[Database] Conexión exitosa a MongoDB');
  } catch (error) {
    console.error('[Database] Error crítico al conectar a MongoDB:', error);
    throw error;
  }
};
    