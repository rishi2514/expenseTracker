import { model, Schema } from "mongoose";

const groupMemberSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    role: {
      type: String,
      enum: ["admin", "member", "creator"],
    },
  },
  { timestamps: true }
);

export const GroupMember = model("GroupMember", groupMemberSchema);
