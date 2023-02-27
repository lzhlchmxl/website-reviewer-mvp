import Express from 'express';
import Path from 'node:path';
import * as T from './types';
import fetch from 'node-fetch';
import md5 from 'md5';

const app = Express();

const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;
const host = process.env.HOST ||  "127.0.0.1";

// Serve static files from the latest production React app build
app.use(Express.static(Path.join('..', 'website-reviewer-client', 'build')));

// Parse JSON requests automatically
app.use(Express.json());

app.post('/api/capture-snapshot', async (req, res) => {

  const { accessKey, websiteURL, viewportWidth, viewportHeight }: T.snapshotParams = req.body;
  const secret_key = md5(`${websiteURL}8hA6#bbdM|T$VdvwWp]#Fl5SkR.kN`);

  const response = await fetch(`http://api.screenshotlayer.com/api/capture?access_key=${accessKey}&url=${websiteURL}&viewport=${viewportWidth}x${viewportHeight}&fullpage=1&secret_key=${secret_key}`);
 

  const imageBlob = await response.blob();
  const imageDataUrl = URL.createObjectURL(imageBlob);

  res.send(imageDataUrl);

})


// Serve index.html to all other routes
app.get('/*', (_req, res) => {
  res.sendFile(Path.join(process.cwd(), '..', 'website-reviewer-client', 'build', 'index.html'));
});

// Run the server
app.listen(port, host, () => {
  console.log(`Server running at host ${host} on port ${port}`);
});
