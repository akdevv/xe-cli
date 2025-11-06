import { Command } from 'commander';
import { PackageManagerExecutor } from '@/core/pm/executor.ts';
import { logger } from '@/utils/logger.ts';

export function initCommand(program: Command): void {
  program
    .command('init')
    .description('Initialize a new project')
    .option('-y, --yes', 'Skip prompts and use defaults')
    .action(async (options) => {
      try {
        const executor = new PackageManagerExecutor();
        const args = options.yes ? ['-y'] : [];
        await executor.execute('init', args);
        logger.success('Project initialized!');
      } catch (error) {
        logger.error('Initialization failed:', error);
        process.exit(1);
      }
    });
}