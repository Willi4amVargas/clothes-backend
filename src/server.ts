import { boostrap } from "@/app";
import { env } from "@/config/env";

const app = boostrap();
const PORT = env.PORT || 3000;
// despues se arregla para que no sea solo el console.log
const HOST = env.HOST || "localhost";

app.listen(PORT, () => {
  console.log("Listen on http://" + HOST + ":" + PORT);
});
