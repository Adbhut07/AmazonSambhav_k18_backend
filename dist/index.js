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
const db_1 = __importDefault(require("./db/db"));
const dotenv_1 = __importDefault(require("dotenv"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
if (!process.env.GOOGLE_CREDS) {
    throw new Error("GOOGLE_CREDS environment variable is not defined");
}
const serviceAccount = JSON.parse(process.env.GOOGLE_CREDS);
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount)
});
console.log("Firebase Admin initialized");
app.use(express_1.default.json()); // For parsing JSON bodies
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/v1/auth", auth_route_1.default);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/test-firebase', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield firebase_admin_1.default.auth().listUsers();
        res.status(200).json({ success: true, users });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Firebase operation failed" });
    }
}));
app.listen(port, () => {
    (0, db_1.default)();
    console.log(`Server is running at http://localhost:${port}`);
});
