import mongoose, {
  HydratedDocument,
  InferSchemaType,
  model,
  PaginateModel,
  Schema,
} from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import uniqueValidator from "mongoose-unique-validator";
import "./User"; // Ensure the User model is registered before reference

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

TaskSchema.plugin(mongoosePaginate);
TaskSchema.plugin(uniqueValidator);

export type ITask = InferSchemaType<typeof TaskSchema>;
export type TaskDocument = HydratedDocument<ITask>;

export type TaskDto = Omit<ITask, "_id" | "author" | "createdAt" | "updatedAt"> & {
  _id: string;
  author: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  createdAt: string;
  updatedAt: string;
};

const Task =
  (mongoose.models.Task as PaginateModel<ITask>) ||
  model<ITask, PaginateModel<ITask>>("Task", TaskSchema);

export default Task;
