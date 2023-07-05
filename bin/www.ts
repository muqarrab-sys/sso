import MongoDatabase from "@Infrastructure/Database";
import Routes from "@http/Routes";
import { config as envConfig } from "dotenv";
import App from "./App";

envConfig();

const app = new App();

app.setPort(process.env.PORT);
app.connectDatabase(new MongoDatabase());
app.initiateRoutes(Routes);
app.start();
