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
    },
    category: {
      _id: { 
        type: Schema.Types.ObjectId, 
        ref: "Category" 
      },
      name: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ["UPI", "CASH", "BANK"],
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Transaction = model("Transaction", transactionSchema);
