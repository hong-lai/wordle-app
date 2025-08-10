import app from "./app";
import config from "./config";

const PORT = config.PORT;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
})
