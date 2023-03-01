export type snapshotParams = {
  websiteUrl: string,
  viewportWidth: number,
  viewportHeight: number,
}

export type Database = { reviews: review[] }
export type review = {
  id: string,
} & newReview;

export type newReview = {
  name: string,
  notes: note[],
  imageUrl: string,
}

export type reviewHeader = {
  id: string,
  name: string,
}

export type note = {
  id: string,
  text: string,
  isActive: boolean,
  x: number,
  y: number,
}