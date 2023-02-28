export type snapshotParams = {
  websiteUrl: string,
  viewportWidth: number,
  viewportHeight: number,
}

export type Database = review[]
export type review = {
  id: string,
} & newReview;

export type newReview = {
  name: string,
  notes: note[],
  imageUrl: string,
}

export type note = {
  id: string,
  text: string,
  isActive: boolean,
  x: number,
  y: number,
}