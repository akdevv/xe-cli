import { Command } from 'commander';
import { execa } from 'execa';
import { logger } from '@/utils/logger.ts';

async function getCurrentBranch(): Promise<string> {
  try {
    const { stdout } = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
    return stdout.trim();
  } catch (error) {
    throw new Error('Failed to get current branch. Are you in a git repository?');
  }
}

export function pushCommand(git: Command): void {
  git
    .command('push')
    .description('Push to remote repository (auto-detects current branch)')
    .option('-u, --set-upstream', 'Set upstream for the branch')
    .argument('[remote]', 'Remote name or branch name (default: origin)')
    .argument('[branch]', 'Branch name')
    .action(async (remote?: string, branch?: string, options?: { setUpstream?: boolean }) => {
      try {
        let finalRemote: string = 'origin';
        let finalBranch: string;

        if (!remote && !branch) {
          // No arguments: push to current branch
          finalBranch = await getCurrentBranch();
          logger.info(`Auto-detected branch: ${finalBranch}`);
        } else if (remote && !branch) {
          // One argument: treat as branch name, use origin as remote
          finalRemote = 'origin';
          finalBranch = remote;
        } else if (remote && branch) {
          // Two arguments: remote and branch
          finalRemote = remote;
          finalBranch = branch;
        } else {
          // Fallback
          finalBranch = await getCurrentBranch();
        }

        logger.info(`Pushing to ${finalRemote}/${finalBranch}...`);

        // Build git push command arguments
        const args = ['push'];
        if (options?.setUpstream) {
          args.push('-u');
        }
        args.push(finalRemote, finalBranch);

        await execa('git', args, {
          stdio: 'inherit',
        });
        
        logger.success(`Pushed successfully to ${finalRemote}/${finalBranch}!`);
      } catch (error) {
        logger.error('Git push failed:', error);
        process.exit(1);
      }
    });
}