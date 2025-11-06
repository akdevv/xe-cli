export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

export interface PmCommand {
  install: string;
  installDev: string;
  installGlobal: string;
  uninstall: string;
  init: string;
  update: string;

  // scripts
  start: string;
  dev: string;
  build: string;
  lint: string;
  run: string;
}

export const PM_COMMANDS: Record<PackageManager, PmCommand> = {
  npm: {
    install: "npm install",
    installDev: "npm install --save-dev",
    installGlobal: "npm install --global",
    uninstall: "npm uninstall",
    init: "npm init",
    update: "npm update",
    start: "npm start",
    dev: "npm run dev",
    build: "npm run build",
    lint: "npm lint",
    run: "npm run",
  },
  pnpm: {
    install: "pnpm add",
    installDev: "pnpm add -D",
    installGlobal: "pnpm add -g",
    uninstall: "pnpm remove",
    init: "pnpm init",
    update: "pnpm update",
    start: "pnpm start",
    dev: "pnpm run dev",
    build: "pnpm run build",
    lint: "pnpm lint",
    run: "pnpm run",
  },
  yarn: {
    install: "yarn add",
    installDev: "yarn add -D",
    installGlobal: "yarn add -g",
    uninstall: "yarn remove",
    init: "yarn init",
    update: "yarn update",
    start: "yarn start",
    dev: "yarn run dev",
    build: "yarn run build",
    lint: "yarn lint",
    run: "yarn run",
  },
  bun: {
    install: "bun add",
    installDev: "bun add -D",
    installGlobal: "bun add -g",
    uninstall: "bun remove",
    init: "bun init",
    update: "bun update",
    start: "bun start",
    dev: "bun run dev",
    build: "bun run build",
    lint: "bun lint",
    run: "bun run",
  },
};

export const LOCK_FILES: Record<PackageManager, string> = {
  npm: "package-lock.json",
  pnpm: "pnpm-lock.yaml",
  yarn: "yarn.lock",
  bun: "bun.lockb",
};
