export type snapshotParams = {
  accessKey: string,
  websiteURL: string,
  viewportWidth?: number,
  viewportHeight?: number,
  imageWidth?: number,
}

export type note = {
  id: string,
  text: string,
  isActive: boolean,
  x: number,
  y: number,
}