import mongoose, {
  HydratedDocument,
  InferSchemaType,
  model,
  PaginateModel,
  Schema,
} from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import uniqueValidator from "mongoose-unique-validator";

const UserSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    address: {
      type: String,
      default: "Abovyan",
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.plugin(mongoosePaginate);
UserSchema.plugin(uniqueValidator);

export type IUser = InferSchemaType<typeof UserSchema>;
export type UserDocument = HydratedDocument<IUser>;

export type UserDto = Omit<IUser, "_id"> & {
  _id: string;
};

const User =
  (mongoose.models.User as PaginateModel<IUser>) ||
  model<IUser, PaginateModel<IUser>>("User", UserSchema);

export default User;
