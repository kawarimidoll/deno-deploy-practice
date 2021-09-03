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

function getLogger(logLevel: LevelName) {
  return logLevel === "critical" ? console.error : console[logLevel];
}

function output(date: Date, logLevel: LevelName, msg: unknown[]) {
  getLogger(logLevel)(
    logStyles[logLevel](
      `${toISO8601String(date)} ${logLevel.toUpperCase().padEnd(5)}`,
    ),
    ...msg,
  );
}

function debug(...msg: unknown[]) {
  output(new Date(), "debug", msg);
}
function info(...msg: unknown[]) {
  output(new Date(), "info", msg);
}
function warn(...msg: unknown[]) {
  output(new Date(), "warn", msg);
}
function error(...msg: unknown[]) {
  output(new Date(), "error", msg);
}
function critical(...msg: unknown[]) {
  output(new Date(), "critical", msg);
}
function debugN(...msg: unknown[]) {
  debug(...msg, "\n");
}
function infoN(...msg: unknown[]) {
  info(...msg, "\n");
}
function warnN(...msg: unknown[]) {
  warn(...msg, "\n");
}
function errorN(...msg: unknown[]) {
  error(...msg, "\n");
}
function criticalN(...msg: unknown[]) {
  critical(...msg, "\n");
}

export const log = {
  debug,
  info,
  warn,
  error,
  critical,
  debugN,
  infoN,
  warnN,
  errorN,
  criticalN,
};
