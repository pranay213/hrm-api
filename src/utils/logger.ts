import { createLogger, format, transports } from 'winston';
import fs from 'fs';
import path from 'path';
import 'winston-console-transport';

// Define the log file path
const logDir = path.join(__dirname, 'logs');

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = createLogger({
  format: format.combine(
    format.colorize(), // Add colorization
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`,
    ),
  ),
  transports: [
    new transports.Console(), // Log to the console with colors
    new transports.File({ filename: path.join(logDir, 'requests.log') }), // Log to a file
  ],
});

export default logger;
