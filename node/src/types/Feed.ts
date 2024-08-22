export type Feed = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  url: string;
  lastFetchedAt: Date | null;
  userId: string;
}