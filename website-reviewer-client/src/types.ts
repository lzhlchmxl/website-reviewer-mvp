export type SnapshotParams = {
  websiteUrl: string,
  viewportWidth?: number,
  viewportHeight?: number,
  imageWidth?: number,
}

export type NewNote = {
  id: string,
  text: null,
  isActive: boolean,
  x: number,
  y: number,
}

export type Note = {
  id: string,
  text: string | null,
  isActive: boolean,
  x: number,
  y: number,
}

export type ReviewId = string

export type NewReview = {
  imageUrl: string,
  notes: Note[],
  name: string,
}

export type Review = {
  id: ReviewId
} & NewReview;

export type SnapshotMaskRef = {
  getNotesState: () => Note[]
}