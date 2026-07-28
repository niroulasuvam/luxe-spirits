import app from "./src/app";
import { SERVER_PORT } from "./src/configs/constant";
import { initializeDatabase } from "./src/database/mongodb";

initializeDatabase();

app.listen(SERVER_PORT, () => {
  console.log(` Luxe Spirits Server running at: http://localhost:${SERVER_PORT}`);
});