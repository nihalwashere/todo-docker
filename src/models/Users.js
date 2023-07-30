import mongoose from "mongoose";

const collection = "Users";

const UsersSchema = new mongoose.Schema(
  {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    email: {
      type: String,
      index: true
    },
    password: {
      type: String
    }
  },
  { timestamps: true, collection }
);

const UsersModel = mongoose.model(collection, UsersSchema);

export default UsersModel;
