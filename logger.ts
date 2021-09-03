import {
  blue,
  bold,
  red,
  yellow,
} from "https://deno.land/std@0.106.0/fmt/colors.ts";

function toISO8601String(datetime: Date): string {
  const d = new Date(datetime.getTime() - datetime.getTimezoneOffset() * 6e4);
  return d.toISOString().slice(0, -5) +
    d.toString().replace(/^.*GMT([-+]\d{2})(\d{2}).*$/, "$1:$2");
}

const logStyles = {
  debug: (msg: string) => msg,
  info: blue,
  warn: yellow,
  error: red,
  critical: (msg: string) => bold(red(msg)),
};
type LevelName = keyof typeof logStyles;

function output(date: Date, logLevel: LevelName, msg: unknown[]) {
  const logger = logLevel === "critical" ? console.error : console[logLevel];
  logger(
    logStyles[logLevel](`${toISO8601String(date)} ${logLevel.toUpperCase()}`),
  );
  logger(...msg);
  logger();
}

const log = {
  debug: (...msg: unknown[]) => {
    output(new Date(), "debug", msg);
  },
  info: (...msg: unknown[]) => {
    output(new Date(), "info", msg);
  },
  warn: (...msg: unknown[]) => {
    output(new Date(), "warn", msg);
  },
  error: (...msg: unknown[]) => {
    output(new Date(), "error", msg);
  },
  critical: (...msg: unknown[]) => {
    output(new Date(), "critical", msg);
  },
};

export { log };
