import { Command } from "commander";
import { execa } from "execa";
import { logger } from "@/utils/logger.ts";

export function registerGithubCommands(program: Command): void {
  const github = program
    .command("gh")
    .description("GitHub CLI commands")
    .allowUnknownOption(true);

  // Default action: Show status dashboard
  github.action(async () => {
    try {
      logger.info("GitHub Status Dashboard");
      logger.info("======================\n");

      // Auth status
      logger.info("Authentication:");
      await execa("gh", ["auth", "status"], { stdio: "inherit" });

      console.log("");

      // Repo info
      logger.info("Repository:");
      await execa("gh", ["repo", "view"], { stdio: "inherit" });

      console.log("");

      // Open PRs
      logger.info("Open Pull Requests:");
      await execa("gh", ["pr", "list", "--limit", "5"], { stdio: "inherit" });

      console.log("");

      // Assigned issues
      logger.info("Assigned Issues:");
      await execa("gh", ["issue", "list", "--assignee", "@me", "--limit", "5"], {
        stdio: "inherit",
      });
    } catch (error) {
      logger.error("Failed to fetch GitHub status:", error);
      process.exit(1);
    }
  });

  github
    .command("repo-create <name>")
    .description("Create a new GitHub repository")
    .option("--public", "Make repository public")
    .option("--private", "Make repository private")
    .action(
      async (
        name: string,
        options: { public?: boolean; private?: boolean }
      ) => {
        try {
          logger.info(`Creating repository ${name}...`);
          const args = ["repo", "create", name];

          if (options.public) args.push("--public");
          if (options.private) args.push("--private");

          await execa("gh", args, { stdio: "inherit" });
          logger.success("Repository created!");
        } catch (error) {
          logger.error("Failed to create repository:", error);
          process.exit(1);
        }
      }
    );

  github
    .command("pr-create")
    .alias("prc")
    .description("Create a pull request (opens in browser)")
    .action(async () => {
      try {
        logger.info("Creating pull request...");
        await execa("gh", ["pr", "create", "--web"], { stdio: "inherit" });
      } catch (error) {
        logger.error("Failed to create PR:", error);
        process.exit(1);
      }
    });

  github
    .command("pr-checkout <number>")
    .alias("pco")
    .description("Checkout a pull request locally")
    .action(async (number: string) => {
      try {
        logger.info(`Checking out PR #${number}...`);
        await execa("gh", ["pr", "checkout", number], { stdio: "inherit" });
        logger.success(`PR #${number} checked out!`);
      } catch (error) {
        logger.error("Failed to checkout PR:", error);
        process.exit(1);
      }
    });

  github
    .command("pr-merge [number]")
    .alias("prm")
    .description("Merge a pull request")
    .option("-s, --squash", "Squash commits")
    .option("-r, --rebase", "Rebase and merge")
    .option("-m, --merge", "Create a merge commit")
    .action(
      async (
        number: string | undefined,
        options: { squash?: boolean; rebase?: boolean; merge?: boolean }
      ) => {
        try {
          logger.info("Merging pull request...");
          const args = ["pr", "merge"];
          if (number) args.push(number);

          if (options.squash) args.push("--squash");
          else if (options.rebase) args.push("--rebase");
          else if (options.merge) args.push("--merge");

          await execa("gh", args, { stdio: "inherit" });
          logger.success("PR merged!");
        } catch (error) {
          logger.error("Failed to merge PR:", error);
          process.exit(1);
        }
      }
    );

  github
    .command("pr-view [number]")
    .description("View a pull request")
    .action(async (number: string | undefined) => {
      try {
        const args = ["pr", "view"];
        if (number) args.push(number);

        await execa("gh", args, { stdio: "inherit" });
      } catch (error) {
        logger.error("Failed to view PR:", error);
        process.exit(1);
      }
    });

  github
    .command("issue-create")
    .description("Create an issue (opens in browser)")
    .action(async () => {
      try {
        logger.info("Creating issue...");
        await execa("gh", ["issue", "create", "--web"], { stdio: "inherit" });
      } catch (error) {
        logger.error("Failed to create issue:", error);
        process.exit(1);
      }
    });

  github
    .command("clone <repo>")
    .description("Clone a repository")
    .action(async (repo: string) => {
      try {
        logger.info(`Cloning ${repo}...`);
        await execa("gh", ["repo", "clone", repo], { stdio: "inherit" });
        logger.success("Repository cloned!");
      } catch (error) {
        logger.error("Failed to clone repository:", error);
        process.exit(1);
      }
    });

  github
    .command("auth")
    .description("Check GitHub authentication status")
    .action(async () => {
      try {
        await execa("gh", ["auth", "status"], { stdio: "inherit" });
      } catch (error) {
        logger.error("Failed to check auth status:", error);
        process.exit(1);
      }
    });

  // === POWER COMMANDS (Workflow Automation) ===

  github
    .command("ship [message]")
    .description(
      "Quick workflow: stage all, commit, push, and create PR (all in one!)"
    )
    .action(async (message: string | undefined) => {
      try {
        logger.info("🚀 Starting ship workflow...\n");

        // Stage all changes
        logger.info("Step 1/4: Staging changes...");
        await execa("git", ["add", "."], { stdio: "inherit" });
        logger.success("✓ Changes staged!\n");

        // Commit
        logger.info("Step 2/4: Committing...");
        const commitMessage = message || "Quick update";
        await execa("git", ["commit", "-m", commitMessage], {
          stdio: "inherit",
        });
        logger.success("✓ Committed!\n");

        // Push
        logger.info("Step 3/4: Pushing to remote...");
        await execa("git", ["push"], { stdio: "inherit" });
        logger.success("✓ Pushed!\n");

        // Create PR
        logger.info("Step 4/4: Creating pull request...");
        await execa("gh", ["pr", "create", "--web"], { stdio: "inherit" });

        logger.success("\n🎉 Ship workflow completed!");
      } catch (error) {
        logger.error("Ship workflow failed:", error);
        process.exit(1);
      }
    });

  github
    .command("sync")
    .description("Sync with remote: fetch, pull, and update current branch")
    .action(async () => {
      try {
        logger.info("🔄 Syncing with remote...\n");

        logger.info("Step 1/2: Fetching from remote...");
        await execa("git", ["fetch", "--all", "--prune"], {
          stdio: "inherit",
        });
        logger.success("✓ Fetched!\n");

        logger.info("Step 2/2: Pulling changes...");
        await execa("git", ["pull"], { stdio: "inherit" });
        logger.success("✓ Pulled!\n");

        logger.success("🎉 Sync completed!");
      } catch (error) {
        logger.error("Sync failed:", error);
        process.exit(1);
      }
    });

  github
    .command("quickfix <issue-number>")
    .description(
      "Quick workflow: create branch from issue, make it current, ready for commits"
    )
    .action(async (issueNumber: string) => {
      try {
        logger.info(`🔧 Starting quickfix workflow for issue #${issueNumber}...\n`);

        // Get issue title for branch name
        logger.info("Step 1/2: Fetching issue details...");
        const { stdout: issueTitle } = await execa("gh", [
          "issue",
          "view",
          issueNumber,
          "--json",
          "title",
          "--jq",
          ".title",
        ]);

        // Create branch name from issue
        const branchName = `fix/${issueNumber}-${issueTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .substring(0, 50)}`;

        logger.success(`✓ Branch name: ${branchName}\n`);

        // Create and checkout branch
        logger.info("Step 2/2: Creating and checking out branch...");
        await execa("git", ["checkout", "-b", branchName], {
          stdio: "inherit",
        });
        logger.success("✓ Branch created and checked out!\n");

        logger.success(
          `🎉 Quickfix setup complete! Make your changes and run 'xe gh ship' when ready.`
        );
      } catch (error) {
        logger.error("Quickfix workflow failed:", error);
        process.exit(1);
      }
    });

  github
    .command("approve <pr-number>")
    .description("Quick approve a pull request")
    .option("-c, --comment <comment>", "Add a comment with approval")
    .action(
      async (prNumber: string, options: { comment?: string }) => {
        try {
          logger.info(`Approving PR #${prNumber}...`);
          const args = ["pr", "review", prNumber, "--approve"];

          if (options.comment) {
            args.push("--body", options.comment);
          }

          await execa("gh", args, { stdio: "inherit" });
          logger.success(`PR #${prNumber} approved!`);
        } catch (error) {
          logger.error("Failed to approve PR:", error);
          process.exit(1);
        }
      }
    );

  // Catch-all for any other GitHub CLI commands (passthrough)
  github
    .command("* [args...]", { hidden: true })
    .allowUnknownOption(true)
    .action(async (commandName: string, args: string[] = []) => {
      try {
        // Pass through to native gh command
        const ghArgs = [commandName, ...args];
        logger.debug(`Executing: gh ${ghArgs.join(" ")}`);

        await execa("gh", ghArgs, {
          stdio: "inherit",
        });
      } catch (error) {
        logger.error("GitHub CLI command failed:", error);
        process.exit(1);
      }
    });
}
