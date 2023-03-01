import Express from 'express';
import Path from 'node:path';
import * as T from './types';
import fetch from 'node-fetch';
import md5 from 'md5';
import fs from 'fs';
import { readDatabase, writeDatabase } from './database';
const generateUniqueId = require('generate-unique-id');

const app = Express();

const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;
const host = process.env.HOST ||  "127.0.0.1";

// Serve static files from the latest production React app build
app.use(Express.static(Path.join('..', 'website-reviewer-client', 'build')));
app.use(Express.static(Path.join(__dirname, 'public')));

// Parse JSON requests automatically
app.use(Express.json());

/*
  GET /review-list
  Description: retrieve a list of review headers from server
  Request body: no request body
  Response body: ReviewHeader[]
*/
app.get('/api/review-list', async (_req, res) => {

  const database = await readDatabase();

  const reviewHeaders: T.ReviewHeader[] = database.reviews.map( review => {
    return { id: review.id, name: review.name }
  })

  res.send(reviewHeaders);
})

/*
  GET /review-list:reviewId
  Description: retrieve detailed information on a review with given ID
  Request body: no request body
  Response body: ReviewDetail
*/
app.get('/api/review-list/:reviewId', async (req, res) => {

  const database = await readDatabase();

  const review = database.reviews.find( review => review.id === req.params.reviewId );

  if (review === undefined) {
    res.status(204).send();
    console.log(`No review found with the given ID: ${req.params.reviewId}`);
  }

  res.send(review);
})

/*
  POST /api/capture-snapshot
  Description: fetch image from screenshotlayer's API and save the image on server
  Request body: T.SnapshotParams
  Response body: image blob
*/
app.post('/api/capture-snapshot', async (req, res) => {

  const { websiteUrl, viewportWidth, viewportHeight }: T.SnapshotParams = req.body;

  const access_key = 'a02aeaf299f062eb982f088fad8d5397';
  const secret_key = md5(`${websiteUrl}8hA6#bbdM|T$VdvwWp]#Fl5SkR.kN`);

  const response = await fetch(`http://api.screenshotlayer.com/api/capture?access_key=${access_key}&url=${websiteUrl}&viewport=${viewportWidth}x${viewportHeight}&fullpage=1&secret_key=${secret_key}`);

  const buffer = await response.buffer();
  const imageName = `screenshot-${Date.now()}.png`; // generate a unique image name
  const imagePath = Path.resolve(__dirname, 'public', imageName);
  fs.writeFileSync(imagePath, buffer); // save the image to the server

  const imageURL = `http://${host}:${port}/${imageName}`; // set the image URL

  res.send(imageURL);

});

/*
  POST /api/review/create
  Description: create a new review
  Request body: T.NewReview
  Response body: T.ReviewId
*/
app.post('/api/review/create', async (req, res) => {
  const database = await readDatabase();
  const {name, notes, imageUrl}: T.NewReview = req.body;
  const id = generateUniqueId();
  const newReview = {
    id,
    name,
    notes,
    imageUrl
  }
  database.reviews.push(newReview);

  await writeDatabase(database);

  res.send(id);
})

/*
  PUT /api/review/save
  Description: save an existing review
  Request body: T.Review
  Response body: T.ReviewId
*/
app.put('/api/review/save', async (req, res) => {
  const database = await readDatabase();
  const {id, name, notes}: T.Review = req.body;
  const targetReview = database.reviews.find( review => review.id === id);
  if (targetReview === undefined) {
    res.status(204).send();
    console.log(`No review found with the given ID: ${id}`);
  } else {
    targetReview.name = name;
    targetReview.notes = notes;
  }

  await writeDatabase(database);

  res.send(id);
})

/*
  DELETE /api/reviews/:reviewId
  Description: delete an existing review from database
  Request body: no request body
  Response body: T.ReviewId
*/
app.delete('/api/reviews/:reviewId', async (req, res) => {
  const database = await readDatabase();
  const reviewId = req.params.reviewId;
  database.reviews = database.reviews.filter( review => review.id !== reviewId);

  console.log(database);
  await writeDatabase(database);
  // No content response
  res.status(204).send();
})


// Serve index.html to all other routes
app.get('/*', (_req, res) => {
  res.sendFile(Path.join(process.cwd(), '..', 'website-reviewer-client', 'build', 'index.html'));
});

// Run the server
app.listen(port, host, () => {
  console.log(`Server running at host ${host} on port ${port}`);
});
