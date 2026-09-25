import 'dotenv/config';
import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';

const port = Number(process.env.PORT ?? 3000);
const app = createApp();

connectDatabase()
  .then(() => {
    app.listen(port, () => console.log(`Servidor escuchando en el puerto ${port}`));
  })
  .catch(() => process.exit(1));
