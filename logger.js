// logger.js
const winston = require('winston');

if (!process.env.DATADOG_API_KEY) {
  console.log('AVISO: Chave de API do Datadog (DATADOG_API_KEY) não encontrada. Os logs não serão enviados para o Datadog.');
}

const transports = [
  new winston.transports.Console({
    format: winston.format.simple(),
  }),
];

if (process.env.DATADOG_API_KEY) {
  transports.push(
    new winston.transports.Http({
      host: 'http-intake.logs.datadoghq.com',
      path: `/api/v2/logs?dd-api-key=${process.env.DATADOG_API_KEY}&ddsource=nodejs&service=todolist-app`,
      ssl: true,
    })
  );
}

const logger = winston.createLogger({
  level: 'info',
  exitOnError: false,
  format: winston.format.json(),
  transports,
});

module.exports = logger;