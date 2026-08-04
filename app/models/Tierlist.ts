import { Schema, models, model, Document } from 'mongoose';

export interface ElementSubdoc {
  _id: Schema.Types.ObjectId;
  name: string;
  imageUrl?: string;
  likes: number;
  dislikes: number;
}

export interface TierlistDoc extends Document {
  title: string;
  slug: string;
  elements: ElementSubdoc[];
  lastActivityAt: Date;
  archived: boolean;
}

const ElementSchema = new Schema<ElementSubdoc>({
  name: { type: String, required: true },
  imageUrl: { type: String },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
});

const TierlistSchema = new Schema<TierlistDoc>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    elements: {
      type: [ElementSchema],
      validate: [(arr: unknown[]) => arr.length <= 25, 'Máximo 25 elementos'],
    },
    lastActivityAt: { type: Date, default: Date.now },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

TierlistSchema.index({ lastActivityAt: -1 });
TierlistSchema.index({ archived: 1 });

export default models.Tierlist || model<TierlistDoc>('Tierlist', TierlistSchema);