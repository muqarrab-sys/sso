import UserModel from "@Infrastructure/Persistance/models/users";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import SessionService from "@Services/SessionService";
import { RequestWithUser } from "@interfaces/index";
import z from "zod";

class AuthController {
  private sessionService: SessionService;

  constructor() {
    this.sessionService = new SessionService();
  }

  authenticate: RequestHandler = async (req: RequestWithUser, res) => {
    try {
      const serviceUrl = new URL(req.query.serviceUrl as string);

      const identificationToken = jwt.sign({ uid: req.user.id }, process.env.IDENTITY_TOKEN_SECRET, { expiresIn: "30s" });

      res.redirect(`${serviceUrl.toString()}?identificationToken=${identificationToken}`);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "something went wrong" });
    }
  };

  getIdentity: RequestHandler = async (req, res) => {
    const identificationToken = req.query.identificationToken as string;

    const { uid } = jwt.verify(identificationToken, process.env.IDENTITY_TOKEN_SECRET) as { uid: string };

    const user = await UserModel.findById(uid);

    if (user) {
      res.status(200).json(user);
    }
  };

  signup: RequestHandler = async (req, res) => {
    const { name, email, password, redirectUrl } = req.body;

    const schema = z.object({
      password: z
        .string()
        .min(8)
        .max(18)
        .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/, "Password must contain at least 1 of each lowercase, uppercase letters, number, symbol"),
      name: z.string().min(3),
      email: z.string().email(),
    });

    const validate = schema.safeParse({ name, email, password });

    if (!validate.success) {
      return res.send({ success: false, message: validate.error.errors[0].message });
    }

    const user = await UserModel.exists({ email });
    if (user) return res.send({ success: false, message: "This email is already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await new UserModel({ email, name, password: hashed }).save();

    const authorizationToken = await this.sessionService.create({ uid: newUser.id });

    res.cookie("Authorization", authorizationToken, {
      expires: new Date(new Date().setDate(new Date().getDate() + 1)),
      httpOnly: true,
      signed: true,
    });

    const url = new URL(redirectUrl as string);
    res.redirect(url.toString());
  };

  login: RequestHandler = async (req, res) => {
    const { email, password, redirectUrl } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.send({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.send({ success: false, message: "Wrong email or password" });
    }

    const authorizationToken = await this.sessionService.create({ uid: user.id });

    res.cookie("Authorization", authorizationToken, {
      expires: new Date(new Date().setDate(new Date().getDate() + 1)),
      httpOnly: true,
      signed: true,
    });

    const url = new URL(redirectUrl as string);
    res.redirect(url.toString());
  };

  logout: RequestHandler = async (req, res) => {
    const authorizationToken = req.signedCookies["Authorization"];
    const serviceUrl = new URL(req.query.serviceUrl as string);

    this.sessionService.delete(authorizationToken);

    res.redirect(serviceUrl.toString());
  };
}

export default AuthController;
