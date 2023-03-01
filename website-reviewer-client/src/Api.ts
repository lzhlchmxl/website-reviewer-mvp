import * as T from './types';

export async function getReviews(): Promise<T.Review[]> {
  const response = await fetch('/api/review-list');
  
  if (response.status !== 200) {
    throw new Error("/api/review-list returned HTTP status code: " + response.status);
  }

  const reviewHeaders: T.Review[] = await response.json();

  return reviewHeaders;

}

export async function getReviewDetails(id: T.ReviewId): Promise<T.Review> {
  const response = await fetch(`/api/review-list/${id}`);

  if (response.status !== 200) {
    throw new Error(`/api/review-list/:${id} returned HTTP status code: ${response.status}`);
  }

  const reviewDetails: T.Review = await response.json();

  return reviewDetails;
}

export async function captureSnapshot(params: T.SnapshotParams): Promise<string> {

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

export async function createReview(params: T.NewReview): Promise<T.ReviewId> {
  
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

export async function saveReview(params: T.Review): Promise<T.ReviewId> {

  const requestOptions = {
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(params),
  }

  const response = await fetch('/api/review/save', requestOptions);

  if (response.status !== 200) {
    throw new Error("/api/review/save returned HTTP status code: " + response.status);
  }

  return response.text();
}

export async function deleteReviewById(id: T.ReviewId): Promise<number> {

  const response = await fetch(`/api/reviews/${id}`, {method: 'delete'});

  if (response.status !== 204) {
    throw new Error(`/api/reviews/${id} returned HTTP status code: ${response.status}`);
  }
  
  return response.status;
}

// curl -X POST -H 'Content-Type: application/json' -d '{}' http://localhost:4000/api/capture-snapshot
