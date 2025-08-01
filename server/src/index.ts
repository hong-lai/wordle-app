import app from "./app";
import dotenv from 'dotenv';
dotenv.config();

const PORT = parseInt(process.env?.PORT ?? '5555');

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
})
