import logger from "@Infrastructure/Utils/logger";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response, Router } from "express";
import { Server } from "http";

class App {
  private app: express.Application;
  private port: number | string;
  private server: Server;

  constructor() {
    this.app = express();

    this.applyCors();
    this.applyMiddleware();
  }

  public start() {
    if (!this.port) {
      throw new Error("Missing port!");
    }

    try {
      this.server = this.app.listen(this.port, () => {
        logger.info(`Listing to http://localhost:${this.port}`);
      });
    } catch (error) {
      logger.error("Couldn't start the server", error);
    }
  }

  public close() {
    if (!this.server) {
      throw new Error("No server initiated");
    }

    try {
      this.server.close();
      logger.info("Server Closed!");
    } catch (error) {
      logger.error("Couldn't close the server", error);
    }
  }

  async connectDatabase(database) {
    await database.connect();
  }

  public initiateRoutes(routers: Array<Router>) {
    routers.forEach(router => {
      this.app.use("/", router);
    });

    this.handleErrorResponse();
  }

  public setPort(port: number | string) {
    this.port = port;
  }

  private applyCors() {
    const whitelist = ["http://localhost:5173", "http://localhost:3000"];
    this.app.use(
      cors({
        credentials: true,
        origin: (origin, callback) => {
          if (whitelist.indexOf(origin as string) !== -1 || !origin) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
      }),
    );
  }

  private applyMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser(process.env.COOKIE_SECRET as string));
  }

  private handleErrorResponse() {
    this.app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      logger.error(err);

      const code = err.httpCode;
      const message = `Oops, looks like something went wrong on our end, we are really sorry for the inconvenience, please try again a bit later or contact us the problem still persists!`;

      res.status(code).json({ success: false, message });
    });
  }
}

export default App;
