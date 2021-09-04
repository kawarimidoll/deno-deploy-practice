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

type ShowLevelName = "none" | "full" | "initial" | "symbol";

export class Log {
  minLogLevel: LevelName;
  showLevelName: ShowLevelName;
  showTimestamp: boolean;
  addNewLine: boolean;

  constructor({
    minLogLevel = "debug",
    showLevelName = "symbol",
    showTimestamp = true,
    addNewLine = false,
  }: {
    minLogLevel?: LevelName;
    showLevelName?: ShowLevelName;
    showTimestamp?: boolean;
    addNewLine?: boolean;
  } = {}) {
    this.minLogLevel = minLogLevel;
    this.showLevelName = showLevelName;
    this.showTimestamp = showTimestamp;
    this.addNewLine = addNewLine;
  }

  output(date: Date, logLevel: LevelName, msg: unknown[]) {
    const { color } = LOG_LEVELS[logLevel];
    const timestamp = this.showTimestamp ? toISO8601String(date) : "";
    const level = {
      none: "",
      full: " " + logLevel.toUpperCase().padEnd(5),
      initial: " " + logLevel[0].toUpperCase(),
      symbol: " " + LOG_LEVELS[logLevel].symbol,
    }[this.showLevelName];

    console[logLevel](
      color(`${timestamp}${level}`),
      ...msg,
      ...[this.addNewLine ? "\n" : ""],
    );
  }

  debug(...msg: unknown[]) {
    this.output(new Date(), "debug", msg);
  }
  info(...msg: unknown[]) {
    this.output(new Date(), "info", msg);
  }
  warn(...msg: unknown[]) {
    this.output(new Date(), "warn", msg);
  }
  error(...msg: unknown[]) {
    this.output(new Date(), "error", msg);
  }
}
