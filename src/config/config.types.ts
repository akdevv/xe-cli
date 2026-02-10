export interface XeConfig {
  version: string;
  extensions: {
    git: boolean;
    github: boolean;
    prisma: boolean;
    docker: boolean;
    shadcn: boolean;
  };
  aliases: Record<string, string>;
  customCommands: Record<string, string>;
  pm: "auto" | "npm" | "pnpm" | "yarn" | "bun";
  features: {
    autoCommit: boolean;
  };
}

export const DEFAULT_CONFIG: XeConfig = {
  version: "1.0.0",
  extensions: {
    git: true,
    github: true,
    prisma: true,
    docker: true,
    shadcn: true,
  },
  aliases: {},
  customCommands: {},
  pm: "auto",
  features: {
    autoCommit: false,
  },
};
