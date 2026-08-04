// src/models/Vote.ts
import mongoose, { Schema, models, model } from 'mongoose';

export interface VoteDoc {
  tierlistId: mongoose.Types.ObjectId;
  elementId: mongoose.Types.ObjectId;
  voterUuid: string;
  fingerprintHash?: string;
  voteType: 'like' | 'dislike';
}

const VoteSchema = new Schema<VoteDoc>(
  {
    tierlistId: { type: Schema.Types.ObjectId, ref: 'Tierlist', required: true },
    elementId: { type: Schema.Types.ObjectId, required: true },
    voterUuid: { type: String, required: true },
    fingerprintHash: { type: String },
    voteType: { type: String, enum: ['like', 'dislike'], required: true },
  },
  { timestamps: true }
);

VoteSchema.index({ tierlistId: 1, elementId: 1, voterUuid: 1 }, { unique: true });

export default models.Vote || model<VoteDoc>('Vote', VoteSchema);