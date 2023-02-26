import * as T from './types';
import md5 from 'crypto-js/md5';

export async function captureSnapshot(params: T.snapshotParams): Promise<string> {

  const secretKey = md5(`${params.websiteURL}secret`)

  const response = await fetch(`http://api.screenshotlayer.com/api/capture?access_key=${params.accessKey}&url=${params.websiteURL}&viewport=${params.viewportWidth ? params.viewportWidth : 1440}x${params.viewportHeight? params.viewportHeight : 900}&fullpage=1&secret_key=${secretKey}`);

  if (response.status !== 200) {
    throw new Error("/api.screenshot.com/api/capture returned HTTP status code: " + response.status);
  }

  const imageURL: string = await response.json();

  return imageURL;

}
