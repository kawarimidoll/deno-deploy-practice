import {
  blue,
  red,
  reset,
  yellow,
} from "https://deno.land/std@0.106.0/fmt/colors.ts";
import { datetime } from "https://deno.land/x/ptera@v1.0.0-beta/mod.ts";

export type LevelName = keyof typeof Log.LEVELS;

export class Log {
  static readonly LEVELS = {
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

  private fmt: string;
  private levelSign: (logLevel: LevelName) => string;
  private suffix: string;

  constructor({
    minLogLevel = "debug",
    levelIndicator = "symbol",
    datetimeFormat = "YYYY-MM-ddTHH:mm:ssZ",
    addNewLine = false,
  }: {
    minLogLevel?: LevelName;
    levelIndicator?: "none" | "full" | "initial" | "symbol";
    datetimeFormat?: string;
    addNewLine?: boolean;
  } = {}) {
    for (const level of Object.keys(Log.LEVELS) as LevelName[]) {
      if (minLogLevel === level) break;
      this[level] = () => ({});
    }

    this.fmt = datetimeFormat;
    this.suffix = addNewLine ? "\n" : "";

    this.levelSign = {
      none: () => "",
      full: (logLevel: LevelName) => " " + logLevel.toUpperCase().padEnd(5),
      initial: (logLevel: LevelName) => " " + logLevel[0].toUpperCase(),
      symbol: (logLevel: LevelName) => " " + Log.LEVELS[logLevel].symbol,
    }[levelIndicator];
  }

  timestamp(date: Date) {
    return datetime(date).format(this.fmt);
  }

  output(date: Date, logLevel: LevelName, msg: unknown[]) {
    const prefix = Log.LEVELS[logLevel].color(
      `${this.timestamp(date)}${this.levelSign(logLevel)}`.trimStart(),
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
