import { Schema, model } from "mongoose";

const transactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    transactionType: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Transaction = model("Transaction", transactionSchema)