import winston from "winston";

const { printf, combine, timestamp } = winston.format;
const logFormat = printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`);

const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
  defaultMeta: { service: "user-service" },
  transports: [new winston.transports.Console()],
});

export default logger;
