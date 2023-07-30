import mongoose from "mongoose";

const collection = "Todos";

const TodosSchema = new mongoose.Schema(
  {
    title: {
      type: String
    },
    completed: {
      type: Boolean
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null
    }
  },
  { timestamps: true, collection }
);

const Todos = mongoose.model(collection, TodosSchema);

export default Todos;
