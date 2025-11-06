#!/usr/bin/env node

import { program, initializeCLI, preprocessArgs } from "./cli.ts";
import { handleError } from "@/utils/error.ts";

async function main() {
  try {
    // Initialize CLI and register commands
    await initializeCLI();

    // Preprocess arguments to resolve aliases
    const processedArgs = await preprocessArgs();

    // Parse with resolved arguments
    await program.parseAsync(["node", "xe", ...processedArgs]);
  } catch (error) {
    handleError(error);
    process.exit(1);
  }
}

main();
