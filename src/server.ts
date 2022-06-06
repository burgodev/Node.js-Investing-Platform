import "dotenv/config";
import "express-async-errors";
import http from "http";
import app from "./config/app";
import { l } from "./helpers/general";

const serverHttp = http.createServer(app);

const port = process.env.PORT || 3004;
serverHttp.listen(port, () => l.info(`Server is running on PORT ${port}`));
