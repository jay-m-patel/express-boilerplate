import express from "express";
import * as expressWinston from "express-winston";
import cors from "cors";
import debug from "debug";

import { CommonRoutesConfigs } from "./routes/common/common.routes.configs";
import { UsersRoutes } from "./routes/users/users.routes.configs";
import { errorLoggerOptions, requestLoggerOptions } from "./utils/loggers";
import { defaultErrorHandler } from "./utils/errorHandlers";

const debugLog: debug.IDebugger = debug("server");
const app: express.Application = express();

if(process.env.NODE_ENV === "development") {
    app.use(cors());
}

app.use(express.json());

app.use(expressWinston.logger(requestLoggerOptions));

const routes: Array<CommonRoutesConfigs> = [];

routes.push(new UsersRoutes(app));

app.use(expressWinston.errorLogger(errorLoggerOptions));
app.use(defaultErrorHandler);

const port = process.env.PORT || 8080
app.listen(port, () => {
    routes.forEach((route) => {
        debugLog(`routes configured for ${route.getName()}`);
    })
    debugLog(`server is running on port: ${port}`);
});