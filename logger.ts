import {
  blue,
  red,
  reset,
  yellow,
} from "https://deno.land/std@0.106.0/fmt/colors.ts";

export function toISO8601String(datetime: Date): string {
  const d = new Date(datetime.getTime() - datetime.getTimezoneOffset() * 6e4);
  return d.toISOString().slice(0, -5) +
    d.toString().replace(/^.*GMT([-+]\d{2})(\d{2}).*$/, "$1:$2");
}

export const LOG_LEVELS = {
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

export type LevelName = keyof typeof LOG_LEVELS;

export class Log {
  private timeFmt = toISO8601String;
  private levelSign: (logLevel: LevelName) => string;
  private suffix = "";

  constructor({
    minLogLevel = "debug",
    signType = "symbol",
    showTimestamp = true,
    addNewLine = false,
  }: {
    minLogLevel?: LevelName;
    signType?: "none" | "full" | "initial" | "symbol";
    showTimestamp?: boolean;
    addNewLine?: boolean;
  } = {}) {
    const levels: LevelName[] = ["debug", "info", "warn", "error"];
    for (const level of levels) {
      if (minLogLevel === level) break;
      this[level] = () => ({});
    }

    if (!showTimestamp) {
      this.timeFmt = () => "";
    }
    this.suffix = addNewLine ? "\n" : "";

    this.levelSign = {
      none: () => "",
      full: (logLevel: LevelName) => " " + logLevel.toUpperCase().padEnd(5),
      initial: (logLevel: LevelName) => " " + logLevel[0].toUpperCase(),
      symbol: (logLevel: LevelName) => " " + LOG_LEVELS[logLevel].symbol,
    }[signType];
  }

  output(date: Date, logLevel: LevelName, msg: unknown[]) {
    const prefix = LOG_LEVELS[logLevel].color(
      `${this.timeFmt(date)}${this.levelSign(logLevel)}`.trimStart(),
    );

    console[logLevel](prefix, ...msg, this.suffix);
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
