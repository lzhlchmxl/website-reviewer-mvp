"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_path_1 = __importDefault(require("node:path"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const md5_1 = __importDefault(require("md5"));
const fs_1 = __importDefault(require("fs"));
const database_1 = require("./database");
const generateUniqueId = require('generate-unique-id');
const app = (0, express_1.default)();
const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;
const host = process.env.HOST || "127.0.0.1";
// Serve static files from the latest production React app build
app.use(express_1.default.static(node_path_1.default.join('..', 'website-reviewer-client', 'build')));
app.use(express_1.default.static(node_path_1.default.join(__dirname, 'public')));
// Parse JSON requests automatically
app.use(express_1.default.json());
/*
  GET /review-list
  Description: retrieve a list of review headers from server
  Request body: no request body
  Response body: ReviewHeader[]
*/
app.get('/api/review-list', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const database = yield (0, database_1.readDatabase)();
    const reviewHeaders = database.reviews.map(review => {
        return { id: review.id, name: review.name };
    });
    res.send(reviewHeaders);
}));
/*
  GET /review-list:reviewId
  Description: retrieve detailed information on a review with given ID
  Request body: no request body
  Response body: ReviewDetail
*/
app.get('/api/review-list/:reviewId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const database = yield (0, database_1.readDatabase)();
    const review = database.reviews.find(review => review.id === req.params.reviewId);
    if (review === undefined) {
        res.status(204).send();
        console.log(`No review found with the given ID: ${req.params.reviewId}`);
    }
    res.send(review);
}));
app.post('/api/capture-snapshot', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { websiteUrl, viewportWidth, viewportHeight } = req.body;
    const access_key = 'a02aeaf299f062eb982f088fad8d5397';
    const secret_key = (0, md5_1.default)(`${websiteUrl}8hA6#bbdM|T$VdvwWp]#Fl5SkR.kN`);
    const response = yield (0, node_fetch_1.default)(`http://api.screenshotlayer.com/api/capture?access_key=${access_key}&url=${websiteUrl}&viewport=${viewportWidth}x${viewportHeight}&fullpage=1&secret_key=${secret_key}`);
    const buffer = yield response.buffer();
    const imageName = `screenshot-${Date.now()}.png`; // generate a unique image name
    const imagePath = node_path_1.default.resolve(__dirname, 'public', imageName);
    fs_1.default.writeFileSync(imagePath, buffer); // save the image to the server
    const imageURL = `http://${host}:${port}/${imageName}`; // set the image URL
    res.send(imageURL);
}));
app.post('/api/review/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const database = yield (0, database_1.readDatabase)();
    const { name, notes, imageUrl } = req.body;
    const id = generateUniqueId();
    const newReview = {
        id,
        name,
        notes,
        imageUrl
    };
    database.reviews.push(newReview);
    yield (0, database_1.writeDatabase)(database);
    res.send(id);
}));
// Serve index.html to all other routes
app.get('/*', (_req, res) => {
    res.sendFile(node_path_1.default.join(process.cwd(), '..', 'website-reviewer-client', 'build', 'index.html'));
});
// Run the server
app.listen(port, host, () => {
    console.log(`Server running at host ${host} on port ${port}`);
});
