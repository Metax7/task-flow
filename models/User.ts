import mongoose, {
  HydratedDocument,
  InferSchemaType,
  model,
  Schema,
} from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: String,
    emailVerified: Boolean,
  },
  {
    timestamps: true,
    collection: "user",
  },
);

export type IUser = InferSchemaType<typeof UserSchema>;
export type UserDocument = HydratedDocument<IUser>;

export type UserDto = Omit<IUser, "_id" | "createdAt" | "updatedAt"> & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};

const User = mongoose.models.User || model<IUser>("User", UserSchema);

export default User;
