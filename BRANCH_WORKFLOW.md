# Branch Workflow Guide

This repository uses two separate branches for different development workflows:

## Branch Structure

### `main` Branch

- **Purpose**: Primary development branch using Firebase backend
- **Remote Tracking**: `origin/main`
- **Workflow**: Standard Git workflow with commits and pushes to `origin/main`

### `lovable` Branch

- **Purpose**: Alternative development branch using Supabase backend and separate dependencies
- **Remote Tracking**: `origin/lovable`
- **Workflow**: Independent branch that should NOT be merged with `main`

## Git Configuration

The repository is configured to keep these branches completely separate:

```bash
# Main branch configuration
branch.main.remote = origin
branch.main.merge = refs/heads/main

# Lovable branch configuration
branch.lovable.remote = origin
branch.lovable.merge = refs/heads/lovable

# Auto-setup merge configuration
branch.autoSetupMerge = simple
```

## Working with Branches

### Switching Between Branches

```bash
# Switch to main branch
git checkout main

# Switch to lovable branch
git checkout lovable
```

### Updating from Remote

```bash
# On main branch
git pull origin main

# On lovable branch
git pull origin lovable
```

### Pushing Changes

```bash
# On main branch
git push origin main

# On lovable branch
git push origin lovable
```

## Important Rules

1. **Never merge `lovable` into `main`** or vice versa
2. Each branch has its own dependencies and backend configuration
3. When switching branches, always ensure you're working with the correct backend
4. Use `git fetch origin` to get updates from both branches without merging

## Current Status (as of 2026-01-09)

- ✅ Both branches are synced with their respective remotes
- ✅ `main` branch: Up to date with latest changes including CardStack3D, NeuralConstellation, and InterpreBot assessment
- ✅ `lovable` branch: Synced with `origin/lovable` including Supabase backend configuration
- ✅ Git configured to prevent accidental merges between branches
