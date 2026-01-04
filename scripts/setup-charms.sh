#!/bin/bash

# Charms Protocol Setup Script
# This script helps set up the Charms protocol integration for SolGame

set -e

echo "🔮 Setting up Charms Protocol Integration..."
echo ""

# Check if Rust is installed
if ! command -v rustc &> /dev/null; then
    echo "❌ Rust is not installed. Please install Rust first:"
    echo "   Visit: https://www.rust-lang.org/tools/install"
    exit 1
fi

echo "✅ Rust is installed: $(rustc --version)"
echo ""

# Check if Cargo is installed
if ! command -v cargo &> /dev/null; then
    echo "❌ Cargo is not installed. Please install Cargo (comes with Rust)."
    exit 1
fi

echo "✅ Cargo is installed: $(cargo --version)"
echo ""

# Install Charms CLI
echo "📦 Installing Charms CLI..."
cargo install --locked Charms

# Verify installation
if command -v Charms &> /dev/null; then
    echo "✅ Charms CLI installed successfully!"
    Charms --version
else
    echo "⚠️  Charms CLI installed but not in PATH. You may need to add ~/.cargo/bin to your PATH."
fi

echo ""
echo "📁 Creating charms-apps directory..."
mkdir -p charms-apps

echo ""
echo "✨ Charms setup complete!"
echo ""
echo "Next steps:"
echo "1. Create a Charms app:"
echo "   cd charms-apps"
echo "   Charms app new solgame-tokens"
echo ""
echo "2. Configure your app in the generated directory"
echo ""
echo "3. Use the CharmsProvider in your React components"
echo ""
echo "For more information, see: docs/CHARMS_INTEGRATION.md"

