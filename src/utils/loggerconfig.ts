import winston from 'winston';

const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
  format: winston.format.combine(winston.format.timestamp(), customFormat),
  transports: [new winston.transports.Console()],
});

export default logger;
