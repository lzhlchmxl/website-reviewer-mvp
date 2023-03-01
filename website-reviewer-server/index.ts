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

app.get('/api/review-list', async (_req, res) => {

  const database = await readDatabase();

  const reviewHeaders: T.reviewHeader[] = database.reviews.map( review => {
    return { id: review.id, name: review.name }
  })

  res.send(reviewHeaders);
})


app.post('/api/capture-snapshot', async (req, res) => {

  const { websiteUrl, viewportWidth, viewportHeight }: T.snapshotParams = req.body;

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

app.post('/api/review/create', async (req, res) => {
  const database = await readDatabase();
  const {name, notes, imageUrl}: T.newReview = req.body;
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


// Serve index.html to all other routes
app.get('/*', (_req, res) => {
  res.sendFile(Path.join(process.cwd(), '..', 'website-reviewer-client', 'build', 'index.html'));
});

// Run the server
app.listen(port, host, () => {
  console.log(`Server running at host ${host} on port ${port}`);
});
