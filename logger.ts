import {
  blue,
  red,
  reset,
  yellow,
} from "https://deno.land/std@0.106.0/fmt/colors.ts";

function toISO8601String(datetime: Date): string {
  const d = new Date(datetime.getTime() - datetime.getTimezoneOffset() * 6e4);
  return d.toISOString().slice(0, -5) +
    d.toString().replace(/^.*GMT([-+]\d{2})(\d{2}).*$/, "$1:$2");
}

const LOG_LEVELS = {
  debug: {
    color: reset,
    symbol: "✔",
  },
  info: {
    color: blue,
    symbol: "ℹ",
  },
  warn: {
    color: yellow,
    symbol: "⚠",
  },
  error: {
    color: red,
    symbol: "✖",
  },
};

type LevelName = keyof typeof LOG_LEVELS;

function output(date: Date, logLevel: LevelName, msg: unknown[]) {
  const { color, symbol } = LOG_LEVELS[logLevel];
  console[logLevel](color(`${toISO8601String(date)} ${symbol}`), ...msg);
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

export const log = {
  debug,
  info,
  warn,
  error,
  debugN,
  infoN,
  warnN,
  errorN,
};
