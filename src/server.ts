import app from "./app";
import config from "./config";

const port = config.port;

app.listen(port, () => {
  console.log(`EasyRent server is running in the port no ${port}`);
});
