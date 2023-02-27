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
const app = (0, express_1.default)();
const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;
const host = process.env.HOST || "127.0.0.1";
// Serve static files from the latest production React app build
app.use(express_1.default.static(node_path_1.default.join('..', 'website-reviewer-client', 'build')));
// Parse JSON requests automatically
app.use(express_1.default.json());
app.post('/api/capture-snapshot', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accessKey, websiteURL, viewportWidth, viewportHeight } = req.body;
    const secret_key = (0, md5_1.default)(`${websiteURL}8hA6#bbdM|T$VdvwWp]#Fl5SkR.kN`);
    const response = yield (0, node_fetch_1.default)(`http://api.screenshotlayer.com/api/capture?access_key=${accessKey}&url=${websiteURL}&viewport=${viewportWidth}x${viewportHeight}&fullpage=1&secret_key=${secret_key}`);
    console.log(response.headers);
    console.log(response.body);
    const imageBlob = yield response.blob();
    const imageDataUrl = URL.createObjectURL(imageBlob);
    res.send(imageDataUrl);
}));
// Serve index.html to all other routes
app.get('/*', (_req, res) => {
    res.sendFile(node_path_1.default.join(process.cwd(), '..', 'website-reviewer-client', 'build', 'index.html'));
});
// Run the server
app.listen(port, host, () => {
    console.log(`Server running at host ${host} on port ${port}`);
});
