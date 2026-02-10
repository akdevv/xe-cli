import { logger } from "./logger.ts";

export function handleError(error: any): void {
  if (error.code === "ENOENT") {
    logger.error(
      "Command not found. Make sure the required tool is installed."
    );
  } else if (error.stderr) {
    logger.error("Command failed:");
    console.error(error.stderr);
  } else if (error.message) {
    logger.error(error.message);
  } else {
    logger.error("An unexpected error occurred.");
  }

  if (process.env.DEBUG) {
    console.error(error);
  }
}
