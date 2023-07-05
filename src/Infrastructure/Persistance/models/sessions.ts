import { Schema, model } from "mongoose";

const sessionSchema = new Schema(
  {
    userId: String,
    token: String,
    ttl: String,
  },
  {
    timestamps: true,
  },
);

const SessionModel = model("Session", sessionSchema);

export default SessionModel;
