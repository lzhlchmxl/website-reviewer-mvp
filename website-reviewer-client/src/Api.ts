import * as T from './types';

export async function captureSnapshot(params: T.snapshotParams): Promise<string> {

  const requestOptions = {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  }

  const response = await fetch('/api/capture-snapshot', requestOptions);

  if (response.status !== 200) {
    throw new Error("/api/capture-snapshot returned HTTP status code: " + response.status);
  }

  console.log(response);

  return response.text();
}

// curl -X POST -H 'Content-Type: application/json' -d '{}' http://localhost:4000/api/capture-snapshot
