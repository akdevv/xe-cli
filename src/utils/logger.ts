import chalk from "chalk";

export const logger = {
  info: (msg: string, ...args: any[]) => {
    console.log(chalk.blue("i"), msg, ...args);
  },

  success: (msg: string, ...args: any[]) => {
    console.log(chalk.green("✓"), msg, ...args);
  },

  error: (msg: string, ...args: any[]) => {
    console.error(chalk.red("✗"), msg, ...args);
  },

  warn: (msg: string, ...args: any[]) => {
    console.warn(chalk.yellow("⚠"), msg, ...args);
  },

  debug: (msg: string, ...args: any[]) => {
    if (process.env.DEBUG) {
      console.log(chalk.gray("→"), msg, ...args);
    }
  },

  log: (msg: string, ...args: any[]) => {
    console.log(msg, ...args);
  },
};
