import { type XeConfig, DEFAULT_CONFIG } from "./config.types.ts";

export function getDefaultConfig(): XeConfig {
  return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
}
