import tracer from 'tracer'

// export const logger = pino({
//   level: process.env.PINO_LOG_LEVEL || 'debug',
//   timestamp: pino.stdTimeFunctions.isoTime,
//   // redact: {
//   //   paths: ['email'],
//   // },
// });


export const logger = tracer.colorConsole({
  format: [
    '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})', //default format
    {
      error:
        '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})\nCall Stack:\n{{stack}}' // error format
    }
  ],
  dateformat: 'HH:MM:ss.L',
})