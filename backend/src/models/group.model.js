import { model, Schema } from "mongoose";

const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "GroupMember",
      },
    ],
    isSetteled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Group = model("Group", groupSchema)