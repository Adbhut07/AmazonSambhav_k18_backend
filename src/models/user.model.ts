import mongoose, { Document, model, Schema, ObjectId } from "mongoose";

export interface IUser extends Document {
  _id: ObjectId;
  companyName: string;
  businessType: string;
  email: string;
  personName: string;
  password: string;
  profilePicture?: string;
}

const userSchema = new Schema<IUser>(
  {
    companyName: {
      type: String,
      required: true,
    },
    businessType: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    personName: {
        type: String,
        required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
    },
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export default User;
