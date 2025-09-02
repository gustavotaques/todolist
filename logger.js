// logger.js
const winston = require('winston');
const path = require('path'); // NOVO: Módulo para lidar com caminhos de arquivos
require('dotenv').config();

// ... (verificação da API key) ...

const datadogAttributes = {
  dd: {
    env: process.env.NODE_ENV || 'development',
    service: 'todolist-app',
    version: process.env.npm_package_version,
  }
};

const transports = [
  // Transporte para o Console (continua igual)
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }),

  // NOVO: Transporte para salvar logs em um arquivo
  new winston.transports.File({
    filename: path.join(__dirname, 'logs', 'app.log'), // Salva em <pasta_do_projeto>/logs/app.log
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  })
];

// Adiciona o transporte do Datadog apenas se a chave da API estiver disponível
if (process.env.DATADOG_API_KEY) {
  transports.push(
    new winston.transports.Http({
      host: 'http-intake.logs.us5.datadoghq.com',
      path: `/api/v2/logs?dd-api-key=${process.env.DATADOG_API_KEY}&ddsource=nodejs`,
      ssl: true,
    })
  );
}

const logger = winston.createLogger({
  level: 'info',
  exitOnError: false,
  format: winston.format.json(),
  defaultMeta: datadogAttributes,
  transports, // Usamos nosso array de transportes com tudo configurado
});

module.exports = logger;