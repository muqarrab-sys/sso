import { RequestHandler } from "express";
import path from "path";

class PagesController {
  authorize: RequestHandler = async (req, res) => {
    res.sendFile(path.join(__dirname, "../", "Pages/authorize.html"));
  };

  login: RequestHandler = async (req, res) => {
    res.sendFile(path.join(__dirname, "../", "Pages/login.html"));
  };

  signup: RequestHandler = async (req, res) => {
    res.sendFile(path.join(__dirname, "../", "Pages/signup.html"));
  };

  logout: RequestHandler = async (req, res) => {
    res.sendFile(path.join(__dirname, "../", "Pages/logout.html"));
  };
}

export default PagesController;
