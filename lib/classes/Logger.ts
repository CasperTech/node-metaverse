import * as logger from 'winston';
import * as winston from 'winston';
import * as moment from 'moment';
import * as chalk from 'chalk';
import { TransformableInfo } from 'logform';

const formatLevel = function(text: string, level: string): string
{
    switch (level)
    {
        case 'warn':
            return chalk.yellowBright(text);
        case 'error':
            return chalk.redBright(text);
        case 'debug':
            return chalk.green(text);
        case 'info':
            return chalk.magentaBright(text);
        default:
            return text;
    }
};

const formatMessage = function(text: string, level: string): string
{
    switch (level)
    {
        case 'warn':
            return chalk.yellowBright(text);
        case 'error':
            return chalk.redBright(text);
        default:
            return text;
    }
};

const logFormat = winston.format.printf(function(info: TransformableInfo): string
{
    const logComponents = [
        moment().format('YYYY-MM-DD HH:mm:ss'),
        '-',
        '[' + formatLevel(info.level.toUpperCase(), info.level) + ']',
        formatMessage(info.message, info.level)
    ];
    return logComponents.join(' ');
});

logger.configure({
    format: logFormat,
    silent: false,
    transports: [
        new winston.transports.Console({
            'level': 'debug',
            handleExceptions: true
        })
    ],
});

export class Logger
{
    private static prefixLevel = 0;
    static prefix = '';

    static increasePrefixLevel(): void
    {
        this.prefixLevel++;
        this.generatePrefix();
    }

    static decreasePrefixLevel(): void
    {
        this.prefixLevel--;
        this.generatePrefix();
    }

    static generatePrefix(): void
    {
        this.prefix = '';
        for (let x = 0; x < this.prefixLevel; x++)
        {
            this.prefix += '    ';
        }
        if (this.prefix.length > 0)
        {
            this.prefix += '... ';
        }
    }

    static Debug(message: string | object): void
    {
        if (typeof message === 'string')
        {
            message = this.prefix + message;
        }
        this.Log('debug', message);
    }
    static Info(message: string | object): void
    {
        if (typeof message === 'string')
        {
            message = this.prefix + message;
        }
        this.Log('info', message);
    }
    static Warn(message: string | object): void
    {
        if (typeof message === 'string')
        {
            message = this.prefix + message;
        }
        this.Log('warn', message);
    }
    static Error(message: string | object | unknown): void
    {
        if (typeof message !== 'object')
        {
            message = this.prefix + String(message);
        }
        this.Log('error', message);
    }

    static Log(type: string, message: string | object | unknown): void
    {
        if (typeof message === 'object')
        {
            if (message instanceof Error)
            {
                message = message.message + '\n\n' + message.stack;
            }
            else
            {
                message = JSON.stringify(message);
            }
        }
        logger.log(type, message);
    }
}
