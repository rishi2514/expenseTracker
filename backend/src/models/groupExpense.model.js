import { model, Schema } from "mongoose";

const groupExpenseSchema = new Schema(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
    message: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    paidBy: {
      type: Schema.Types.ObjectId,
      ref: "GroupMember",
    },
    splits: {
      type: Schema.Types.ObjectId,
      ref: "GroupMember",
    },
    recordedBy: {
      type: Schema.Types.ObjectId,
      ref: "GroupMember",
    },
  },
  { timestamps: true }
);

export const GroupExpense = model("GroupExpense", groupExpenseSchema)