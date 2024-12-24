"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
require("winston-console-transport");
// Define the log file path
const logDir = path_1.default.join(__dirname, 'logs');
// Ensure log directory exists
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir);
}
const logger = (0, winston_1.createLogger)({
    format: winston_1.format.combine(winston_1.format.colorize(), // Add colorization
    winston_1.format.timestamp(), winston_1.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)),
    transports: [
        new winston_1.transports.Console(), // Log to the console with colors
        new winston_1.transports.File({ filename: path_1.default.join(logDir, 'requests.log') }), // Log to a file
    ],
});
exports.default = logger;
