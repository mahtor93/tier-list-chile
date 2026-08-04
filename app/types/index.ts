export type Tier = 'S' | 'A' | 'B' | 'C' | 'D';
export type VoteType = 'like' | 'dislike';

export interface ElementDoc {
  _id: string;
  name: string;
  imageUrl?: string;
  likes: number;
  dislikes: number;
  myVote?: VoteType | null;
  tierlistId?: string;
}

export interface RankedElement extends ElementDoc {
  score: number;
  tier: Tier;
}

export interface TierlistDoc {
  _id: string;
  title: string;
  slug: string;
  elements: ElementDoc[];
  lastActivityAt: string;
  archived: boolean;
}