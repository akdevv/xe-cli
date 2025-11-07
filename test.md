# xe CLI Testing Checklist

This document contains a comprehensive list of all commands in the xe CLI project for manual testing. Check off each command as you test it.

## Core Commands

### Package Management

- [ ] `xe install` (install all dependencies)
- [ ] `xe i` (alias for install)
- [ ] `xe install <package>` (install single package)
- [ ] `xe i <package>` (alias for install with package)
- [ ] `xe install <package1> <package2>` (install multiple packages)
- [ ] `xe install -D <package>` (install as dev dependency)
- [ ] `xe install --save-dev <package>` (install as dev dependency)
- [ ] `xe install -g <package>` (install globally)
- [ ] `xe install --global <package>` (install globally)
- [ ] `xe uninstall <package>` (uninstall package)
- [ ] `xe un <package>` (alias for uninstall)
- [ ] `xe uninstall <package1> <package2>` (uninstall multiple packages)
- [ ] `xe update` (update all packages)
- [ ] `xe up` (alias for update)
- [ ] `xe update <package>` (update specific package)
- [ ] `xe update <package1> <package2>` (update multiple packages)

### Project Commands

- [x] `xe init` (initialize new project)
- [x] `xe init -y` (initialize with defaults, skip prompts)
- [x] `xe init --yes` (initialize with defaults, skip prompts)
- [x] `xe run <script>` (run package.json script)
- [ ] `xe run <script> <args...>` (run script with extra arguments)
- [ ] `xe start` (run start script)
- [ ] `xe dev` (run dev script)
- [ ] `xe build` (run build script)
- [ ] `xe lint` (run lint script)
- [ ] `xe scripts` (list all available scripts)
- [ ] `xe ls` (alias for scripts)
- [ ] `xe nuke` (delete all node_modules, with confirmation)
- [ ] `xe nuke -y` (delete all node_modules, skip confirmation)
- [ ] `xe nuke --yes` (delete all node_modules, skip confirmation)
- [ ] `xe nuke --dry-run` (show what would be deleted without deleting)

## Config Commands

### Config Management

- [ ] `xe config path` (show config file path)
- [ ] `xe config edit` (open config file in default editor)
- [ ] `xe config show` (show current configuration)
- [ ] `xe config reset` (reset configuration to defaults)

### Extension Management

- [ ] `xe config ext-enable <extension>` (enable extension: git, github, prisma, docker, shadcn)
- [ ] `xe config ext-disable <extension>` (disable extension)
- [ ] `xe config ext-list` (list all extensions and their status)

### Alias Management

- [ ] `xe config alias-add <alias> <command>` (add command alias)
- [ ] `xe config alias-remove <alias>` (remove command alias)
- [ ] `xe config alias-list` (list all configured aliases)

### Custom Command Management

- [ ] `xe config cmd-add <name> <command>` (add a custom command)
- [ ] `xe config cmd-remove <name>` (remove a custom command)
- [ ] `xe config cmd-list` (list all custom commands)

### Package Manager Configuration

- [ ] `xe config set-pm <manager>` (set package manager: npm, pnpm, yarn, bun, auto)

## Extension Commands

### Git Extension (`xe git` / `xe g`)

#### Git Commands

- [ ] `xe git add` (add all files)
- [ ] `xe g add` (alias for git add)
- [ ] `xe git add .` (add all files explicitly)
- [ ] `xe git add <file>` (add specific file)
- [ ] `xe git add <file1> <file2>` (add multiple files)
- [ ] `xe git push` (push to current branch, auto-detect)
- [ ] `xe g push` (alias for git push)
- [ ] `xe git push <branch>` (push to specific branch on origin)
- [ ] `xe git push <remote> <branch>` (push to specific remote and branch)
- [ ] `xe git push -u` (push and set upstream)
- [ ] `xe git push --set-upstream` (push and set upstream)
- [ ] `xe git save` (add + commit + push with default message)
- [ ] `xe g save` (alias for git save)
- [ ] `xe git save <message>` (add + commit + push with custom message)
- [ ] `xe git sync` (pull with rebase + push)
- [ ] `xe g sync` (alias for git sync)

#### Git Pass-through Commands

- [ ] `xe git status` (pass through to native git)
- [ ] `xe g status` (pass through to native git)
- [ ] `xe git commit -m "message"` (pass through to native git)
- [ ] `xe git log` (pass through to native git)
- [ ] `xe git log --oneline` (pass through to native git)
- [ ] `xe git branch` (pass through to native git)
- [ ] `xe git checkout <branch>` (pass through to native git)
- [ ] `xe git diff` (pass through to native git)
- [ ] `xe git pull` (pass through to native git)
- [ ] `xe git clone <repo>` (pass through to native git)
- [ ] `xe git merge <branch>` (pass through to native git)
- [ ] `xe git rebase <branch>` (pass through to native git)
- [ ] `xe git reset` (pass through to native git)
- [ ] `xe git stash` (pass through to native git)

### GitHub Extension (`xe gh`)

#### Dashboard & Status

- [ ] `xe gh` (show status dashboard: auth, repo, PRs, issues)
- [ ] `xe gh auth` (check GitHub authentication status)

#### Repository Commands

- [ ] `xe gh repo-create <name>` (create new repository)
- [ ] `xe gh repo-create <name> --public` (create public repository)
- [ ] `xe gh repo-create <name> --private` (create private repository)
- [ ] `xe gh clone <repo>` (clone repository)

#### Pull Request Commands

- [ ] `xe gh pr-create` (create PR, opens in browser)
- [ ] `xe gh prc` (alias for pr-create)
- [ ] `xe gh pr-checkout <number>` (checkout PR locally)
- [ ] `xe gh pco <number>` (alias for pr-checkout)
- [ ] `xe gh pr-merge` (merge current PR)
- [ ] `xe gh prm` (alias for pr-merge)
- [ ] `xe gh pr-merge <number>` (merge specific PR)
- [ ] `xe gh pr-merge <number> --squash` (squash merge PR)
- [ ] `xe gh pr-merge <number> -s` (squash merge PR)
- [ ] `xe gh pr-merge <number> --rebase` (rebase merge PR)
- [ ] `xe gh pr-merge <number> -r` (rebase merge PR)
- [ ] `xe gh pr-merge <number> --merge` (create merge commit)
- [ ] `xe gh pr-merge <number> -m` (create merge commit)
- [ ] `xe gh pr-view` (view current PR)
- [ ] `xe gh pr-view <number>` (view specific PR)
- [ ] `xe gh approve <number>` (approve PR)
- [ ] `xe gh approve <number> -c "comment"` (approve PR with comment)
- [ ] `xe gh approve <number> --comment "comment"` (approve PR with comment)

#### Issue Commands

- [ ] `xe gh issue-create` (create issue, opens in browser)

#### Power Workflows

- [ ] `xe gh ship` (complete workflow: add → commit → push → PR)
- [ ] `xe gh ship <message>` (complete workflow with custom commit message)
- [ ] `xe gh sync` (fetch + pull latest changes)
- [ ] `xe gh quickfix <issue-number>` (create branch from issue, ready to work)

#### GitHub Pass-through Commands

- [ ] `xe gh workflow run <workflow>` (pass through to gh CLI)
- [ ] `xe gh release create <tag>` (pass through to gh CLI)
- [ ] `xe gh repo view` (pass through to gh CLI)
- [ ] `xe gh issue list` (pass through to gh CLI)
- [ ] `xe gh pr list` (pass through to gh CLI)

### Docker Extension (`xe docker` / `xe dk`)

#### Container Management

- [ ] `xe docker up` (start containers: docker-compose up -d)
- [ ] `xe dk up` (alias for docker up)
- [ ] `xe docker down` (stop and remove containers)
- [ ] `xe dk down` (alias for docker down)
- [ ] `xe docker restart` (restart containers)
- [ ] `xe dk restart` (alias for docker restart)
- [ ] `xe docker stop` (stop all containers)
- [ ] `xe dk stop` (alias for docker stop)
- [ ] `xe docker stop <service>` (stop specific service)
- [ ] `xe docker start` (start all stopped containers)
- [ ] `xe dk start` (alias for docker start)
- [ ] `xe docker start <service>` (start specific service)

#### Logs & Info

- [ ] `xe docker logs` (show all container logs)
- [ ] `xe dk logs` (alias for docker logs)
- [ ] `xe docker logs <service>` (show logs for specific service)
- [ ] `xe docker logs -f` (follow all logs)
- [ ] `xe docker logs --follow` (follow all logs)
- [ ] `xe docker logs -f <service>` (follow logs for specific service)
- [ ] `xe docker ps` (list running containers)
- [ ] `xe dk ps` (alias for docker ps)

#### Build & Execute

- [ ] `xe docker build` (build docker images)
- [ ] `xe dk build` (alias for docker build)
- [ ] `xe docker exec <service> <command>` (execute command in container)
- [ ] `xe dk exec <service> <command>` (alias for docker exec)
- [ ] `xe docker exec <service> bash` (open bash in container)
- [ ] `xe docker exec <service> sh` (open sh in container)
- [ ] `xe docker exec <service> <command> -it` (interactive terminal)

#### Cleanup

- [ ] `xe docker prune` (remove unused docker resources)
- [ ] `xe dk prune` (alias for docker prune)
- [ ] `xe docker prune -a` (remove all unused images)
- [ ] `xe docker prune --all` (remove all unused images)
- [ ] `xe docker prune -v` (prune volumes as well)
- [ ] `xe docker prune --volumes` (prune volumes as well)
- [ ] `xe docker prune -a -v` (prune all including volumes)

#### Docker Pass-through Commands

- [ ] `xe docker images` (pass through to docker CLI)
- [ ] `xe dk images` (pass through to docker CLI)
- [ ] `xe docker volume ls` (pass through to docker CLI)
- [ ] `xe docker network ls` (pass through to docker CLI)
- [ ] `xe docker compose ps` (pass through to docker CLI)
- [ ] `xe docker ps -a` (pass through to docker CLI)

### Prisma Extension (`xe prisma`)

#### Default Workflow

- [ ] `xe prisma` (run complete workflow: generate → pull → push)

#### Core Commands

- [ ] `xe prisma generate` (generate Prisma Client)
- [ ] `xe prisma gen` (alias for generate)
- [ ] `xe prisma migrate` (run database migrations)
- [ ] `xe prisma migrate -n <name>` (run migration with name)
- [ ] `xe prisma migrate --name <name>` (run migration with name)
- [ ] `xe prisma studio` (open Prisma Studio)

#### Schema Sync

- [ ] `xe prisma push` (push schema to database: db push)
- [ ] `xe prisma pull` (pull schema from database: db pull)

#### Prisma Pass-through Commands

- [ ] `xe prisma format` (pass through to npx prisma)
- [ ] `xe prisma validate` (pass through to npx prisma)
- [ ] `xe prisma db seed` (pass through to npx prisma)
- [ ] `xe prisma migrate reset` (pass through to npx prisma)
- [ ] `xe prisma migrate deploy` (pass through to npx prisma)
- [ ] `xe prisma migrate status` (pass through to npx prisma)
- [ ] `xe prisma db pull` (pass through to npx prisma)
- [ ] `xe prisma db push` (pass through to npx prisma)

### Shadcn Extension (`xe shadcn`)

- [ ] `xe shadcn init` (initialize shadcn-ui with default settings)
- [ ] `xe shadcn add <component>` (add single component)
- [ ] `xe shadcn add <component1> <component2>` (add multiple components)
- [ ] `xe shadcn remove <component>` (remove component)
- [ ] `xe shadcn rm <component>` (alias for remove)

## Alias Testing

### Git Aliases

- [ ] `xe g` (should work as alias for `xe git`)
- [ ] `xe g add` (should work as `xe git add`)
- [ ] `xe g push` (should work as `xe git push`)
- [ ] `xe g save` (should work as `xe git save`)
- [ ] `xe g sync` (should work as `xe git sync`)

### Docker Aliases

- [ ] `xe dk` (should work as alias for `xe docker`)
- [ ] `xe dk up` (should work as `xe docker up`)
- [ ] `xe dk down` (should work as `xe docker down`)
- [ ] `xe dk logs` (should work as `xe docker logs`)

### GitHub Aliases

- [ ] `xe gh prc` (should work as `xe gh pr-create`)
- [ ] `xe gh pco <number>` (should work as `xe gh pr-checkout <number>`)
- [ ] `xe gh prm <number>` (should work as `xe gh pr-merge <number>`)

### Prisma Aliases

- [ ] `xe prisma gen` (should work as `xe prisma generate`)

### Shadcn Aliases

- [ ] `xe shadcn rm <component>` (should work as `xe shadcn remove <component>`)

### Core Command Aliases

- [ ] `xe i` (should work as `xe install`)
- [ ] `xe un` (should work as `xe uninstall`)
- [ ] `xe up` (should work as `xe update`)
- [ ] `xe ls` (should work as `xe scripts`)

## Custom Commands & Scripts

### Custom Commands

- [ ] Create custom command: `xe config cmd-add test "echo hello"`
- [ ] Execute custom command: `xe test`
- [ ] List custom commands: `xe config cmd-list`
- [ ] Remove custom command: `xe config cmd-remove test`

### Package.json Scripts

- [ ] `xe <script-name>` (execute script from package.json)
- [ ] `xe <script-name> <args...>` (execute script with arguments)
- [ ] `xe run <script-name>` (explicitly run script)
- [ ] `xe run <script-name> <args...>` (run script with arguments)
- [ ] Verify error message when script doesn't exist
- [ ] Verify suggestions when script name is similar to existing scripts

### Alias Commands

- [ ] Create alias: `xe config alias-add t "run test"`
- [ ] Execute alias: `xe t`
- [ ] List aliases: `xe config alias-list`
- [ ] Remove alias: `xe config alias-remove t`

## Error Handling & Edge Cases

### Invalid Commands

- [ ] `xe invalid-command` (should show helpful error)
- [ ] `xe git invalid-subcommand` (should pass through to git)
- [ ] `xe gh invalid-subcommand` (should pass through to gh)
- [ ] `xe docker invalid-subcommand` (should pass through to docker)
- [ ] `xe prisma invalid-subcommand` (should pass through to prisma)

### Missing Dependencies

- [ ] Test commands when package.json doesn't exist
- [ ] Test commands when extension is disabled
- [ ] Test git commands when not in git repository
- [ ] Test docker commands when docker-compose.yml doesn't exist

### Configuration Edge Cases

- [ ] Test with missing config file (should create default)
- [ ] Test with invalid config file (should handle gracefully)
- [ ] Test extension enable/disable functionality
- [ ] Test package manager auto-detection

## Notes

- Test in a clean environment when possible
- Test with different package managers (npm, pnpm, yarn, bun)
- Test in both git and non-git repositories
- Test with and without docker-compose.yml
- Test with and without package.json scripts
- Verify all aliases work correctly
- Verify pass-through commands work as expected
- Check error messages are helpful and clear

