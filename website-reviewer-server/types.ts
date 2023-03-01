export type SnapshotParams = {
  websiteUrl: string,
  viewportWidth: number,
  viewportHeight: number,
}

export type Database = { reviews: Review[] }
export type Review = {
  id: string,
} & NewReview;

export type NewReview = {
  name: string,
  notes: Note[],
  imageUrl: string,
}

export type ReviewHeader = {
  id: string,
  name: string,
}

export type Note = {
  id: string,
  text: string,
  isActive: boolean,
  x: number,
  y: number,
}