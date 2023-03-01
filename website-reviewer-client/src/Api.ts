import * as T from './types';

export async function getReviews(): Promise<T.review[]> {
  const response = await fetch('/api/review-list');
  
  if (response.status !== 200) {
    throw new Error("/api/review-list returned HTTP status code: " + response.status);
  }

  const reviewHeaders: T.review[] = await response.json();

  return reviewHeaders;

}

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

  return response.text();
}

export async function saveReview(params: T.newReview): Promise<T.id> {
  
  const requestOptions = {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  }
  
  const response = await fetch('/api/review/create', requestOptions);

  if (response.status !== 200) {
    throw new Error("/api/capture-snapshot returned HTTP status code: " + response.status);
  }

  return response.text();
}

// curl -X POST -H 'Content-Type: application/json' -d '{}' http://localhost:4000/api/capture-snapshot
