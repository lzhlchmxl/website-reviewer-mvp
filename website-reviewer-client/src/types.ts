export type snapshotParams = {
  accessKey: string,
  websiteURL: string,
  viewportWidth?: number,
  viewportHeight?: number,
  imageWidth?: number,
}

export type newNote = {
  id: string,
  text: null,
  isActive: boolean,
  x: number,
  y: number,
}

export type note = {
  id: string,
  text: string | null,
  isActive: boolean,
  x: number,
  y: number,
}