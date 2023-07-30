import mongoose from "mongoose";

export const newId = () => mongoose.Types.ObjectId();

export const newIdString = () => mongoose.Types.ObjectId().toHexString();

export const waitForMilliSeconds = ms =>
  new Promise(resolve => setTimeout(resolve, ms));
