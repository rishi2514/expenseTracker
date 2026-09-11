import { Schema, model } from "mongoose";

const settlementSchema = new Schema(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
    from: {
      type: Schema.Types.ObjectId,
      ref: "GroupMember",
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "GroupMember",
    },
    amount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Settlement = model("Settlement", settlementSchema)