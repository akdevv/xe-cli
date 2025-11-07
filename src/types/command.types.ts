export interface CommandOptions {
  silent?: boolean;
  cwd?: string;
}

export interface ExtensionCommand {
  name: string;
  description: string;
  action: (...args: any[]) => Promise<void>;
}

export interface Extension {
  name: string;
  enabled: boolean;
  commands: ExtensionCommand[];
}
