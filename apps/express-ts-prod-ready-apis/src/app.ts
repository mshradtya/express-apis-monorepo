import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import Controller from "./interfaces/controller.interface";
import errorMiddleware from "./middleware/error.middleware";

class App {
  public app: express.Application;

  constructor(controller: Controller[]) {
    this.app = express();
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controller);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(process.env.PORT || 3000, () => {
      console.log("server listening on port " + process.env.PORT || 3000);
    });
  }

  public getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    mongoose
      .connect(process.env.MONGO_URI, {})
      .then(() => console.log("connected to db"));
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  private initializeErrorHandling() {
    // register error middleware
    this.app.use(errorMiddleware);
  }
}

export default App;
