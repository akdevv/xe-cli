# xe-cli

A lightweight, universal package manager.

## Installation

```bash
npm install -g xe-cli
# or
pnpm add -g xe-cli
# or
yarn global add xe-cli
# or
bun add -g xe-cli
```

## Features

- 🚀 Unified package manager commands
- 🔌 Extensible with Git, GitHub, Prisma, Docker, and Shadcn support
- ⚙️ Customizable aliases and commands
- 🎨 Beautiful CLI interface with colors and spinners
- 🔍 Auto-detects your package manager
- 🌍 Cross-platform support (Windows, Mac, Linux)

## Core Commands

```bash
xe install <package>      # Install packages
xe i <package>            # Alias for install
xe install -D <package>   # Install as dev dependency
xe uninstall <package>    # Uninstall packages
xe init                   # Initialize project
xe run <script>           # Run npm script
xe build                  # Run build script
xe lint                   # Run lint script
```

## Extension Commands

### Git Commands

```bash
# Alias: xe g <command>
xe git add [files...]       # Add files (default: all files)
xe git push [remote] [branch] # Push to remote (auto-detects branch)
xe git push -u              # Push and set upstream
xe git save [message]       # Add + commit + push (one command!)
xe git sync                 # Pull with rebase + push

# Any other git command (passthrough)
xe git status               # Pass through to native git
xe git commit -m "message"  # Pass through to native git
xe git log --oneline        # Pass through to native git
```

### GitHub Commands

```bash
# Dashboard
xe gh                       # Show status dashboard (auth, repo, PRs, issues)

# Repository
xe gh repo-create <name>    # Create new repository
xe gh repo-create <name> --public  # Create public repo
xe gh clone <repo>          # Clone repository

# Pull Requests
xe gh prc                   # Create PR (alias)
xe gh pr-create             # Create PR (opens in browser)
xe gh pco <number>          # Checkout PR locally (alias)
xe gh pr-checkout <number>  # Checkout PR locally
xe gh prm <number>          # Merge PR (alias)
xe gh pr-merge [number]     # Merge PR
xe gh pr-merge <number> --squash   # Squash merge
xe gh pr-merge <number> --rebase   # Rebase merge
xe gh pr-view [number]      # View PR details
xe gh approve <number>      # Quick approve PR
xe gh approve <number> -c "LGTM!"  # Approve with comment

# Issues
xe gh issue-create          # Create issue (opens in browser)

# Authentication
xe gh auth                  # Check authentication status

# 🚀 POWER WORKFLOWS
xe gh ship [message]        # Complete workflow: add → commit → push → PR
xe gh sync                  # Fetch + pull latest changes
xe gh quickfix <issue>      # Create branch from issue, ready to work

# Any other GitHub CLI command (passthrough)
xe gh workflow run deploy   # Pass through to gh CLI
xe gh release create v1.0.0 # Pass through to gh CLI
```

### Docker Commands

```bash
# Alias: xe dk <command>
xe docker up                # Start containers (docker-compose up -d)
xe docker down              # Stop and remove containers
xe docker restart           # Restart containers
xe docker stop [service]    # Stop containers (without removing)
xe docker start [service]   # Start stopped containers

# Logs & Info
xe docker logs [service]    # Show logs
xe docker logs -f [service] # Follow logs
xe docker ps                # List running containers

# Build & Execute
xe docker build             # Build images
xe docker exec <service> <cmd>  # Execute command in container
xe docker exec web bash     # Open bash in 'web' container

# Cleanup
xe docker prune             # Remove unused resources
xe docker prune -a          # Remove all unused images
xe docker prune -a -v       # Prune including volumes

# Any other docker command (passthrough)
xe docker images            # Pass through to docker CLI
xe docker volume ls         # Pass through to docker CLI
```

### Prisma Commands

```bash
# Default Workflow
xe prisma                   # Run: generate + pull + push (complete sync)

# Core Commands
xe prisma generate          # Generate Prisma Client
xe prisma gen               # Alias for generate
xe prisma migrate [options] # Run migrations
xe prisma migrate -n "name" # Run migration with name
xe prisma studio            # Open Prisma Studio

# Schema Sync
xe prisma push              # Push schema to database (db push)
xe prisma pull              # Pull schema from database (db pull)

# Any other prisma command (passthrough)
xe prisma format            # Format schema file
xe prisma validate          # Validate schema
xe prisma db seed           # Seed database
xe prisma migrate reset     # Reset database
xe prisma migrate deploy    # Deploy migrations (production)
```

### Shadcn Commands

```bash
xe shadcn init              # Initialize shadcn-ui
xe shadcn add <component>   # Add component
xe shadcn rm <component>    # Remove component
```

## Real-World Examples

```bash
# Quick development workflow
xe i express typescript      # Install packages
xe gh quickfix 123           # Create branch from issue #123
# ... make changes ...
xe gh ship "Fix login bug"   # Commit + push + create PR

# Database workflow
xe prisma                    # Sync everything (generate + pull + push)
xe prisma migrate -n "add-users"  # Create migration
xe prisma studio             # Open Prisma Studio

# Docker development
xe docker up                 # Start services
xe docker logs -f api        # Watch API logs
xe docker exec api bash      # Debug in container
xe docker prune              # Cleanup when done

# Git shortcuts
xe g save "WIP"              # Quick save (add + commit + push)
xe g sync                    # Sync with remote
xe g status                  # Regular git commands work too
```

## Configuration

xe-cli creates a `.xerc` file in your root dir:

```json
{
  "version": "1.0.0",
  "extensions": {
    "git": true,
    "github": true,
    "prisma": true,
    "docker": true,
    "shadcn": true
  },
  "aliases": {},
  "customCommands": {},
  "pm": "auto",
  "features": {
    "autoCommit": false
  }
}
```

## Custom Aliases

Add your own aliases in `.xerc`:

```json
{
  "aliases": {
    "t": "run test",
    "s": "run start"
  }
}
```
