#!/usr/bin/env node

import { program, initializeCLI } from "./cli.ts";
import { handleError } from "@/utils/error.ts";

async function main() {
  try {
    // Initialize CLI and register commands
    await initializeCLI();

    // Then parse arguments
    await program.parseAsync(process.argv);
  } catch (error) {
    handleError(error);
    process.exit(1);
  }
}

main();
