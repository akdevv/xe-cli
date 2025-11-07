import { Command } from 'commander';
import { execa } from 'execa';
import { logger } from '@/utils/logger.ts';

export function saveCommand(git: Command): void {
  git
    .command('save')
    .description('Add, commit, and push in one command')
    .argument('[message]', 'Commit message (default: "WIP: auto-save")')
    .action(async (message?: string) => {
      try {
        const commitMessage = message || 'WIP: auto-save';

        // Step 1: Add all files
        logger.info('Adding files...');
        await execa('xe', ['git', 'add'], {
          stdio: 'inherit',
        });

        // Step 2: Commit with message
        logger.info(`Committing with message: "${commitMessage}"`);
        await execa('xe', ['git', 'commit', '-m', commitMessage], {
          stdio: 'inherit',
        });

        // Step 3: Push to remote
        logger.info('Pushing changes...');
        await execa('xe', ['git', 'push'], {
          stdio: 'inherit',
        });

        logger.success('Saved successfully! 🎉');
      } catch (error) {
        logger.error('Save failed:', error);
        process.exit(1);
      }
    });
}

