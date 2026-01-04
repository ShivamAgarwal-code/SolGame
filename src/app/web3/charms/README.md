# Charms Protocol Integration

This directory contains the integration for the Charms protocol, which enables programmable tokens/NFTs with app state on Bitcoin using spells in Taproot witnesses.

## Overview

Charms is a protocol for building custom apps on Bitcoin, integrated with Grail Pro for zkBTC. It allows you to create programmable tokens and NFTs with app state management.

## Installation

### Prerequisites

- Rust (latest stable version)
- Cargo package manager

### Install Charms CLI

```bash
cargo install --locked Charms
```

### Verify Installation

```bash
Charms --version
```

## Creating a Charms App

To create a new Charms app for your game tokens/NFTs:

```bash
Charms app new my-token
```

This will create a new Charms app in the `charms-apps/` directory.

## Integration with SolGame

The Charms integration provides:

1. **Token Management**: Create and manage programmable tokens on Bitcoin
2. **NFT Support**: Mint and manage NFTs with app state
3. **Spell System**: Use spells in Taproot witnesses for programmability
4. **State Management**: Maintain app state for game assets

## Usage

See the TypeScript utilities in this directory for examples of how to:
- Initialize a Charms app
- Mint tokens/NFTs
- Query app state
- Execute spells

## Documentation

For more information, visit: https://docs.bitcoinos.build/technical-documentation/grail-pro-charms-zkbtc/technical-overview/charms/charms-development-integration

