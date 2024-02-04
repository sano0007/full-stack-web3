# Hardhat Solidity Contract Starter Boilerplate

## Introduction

This boilerplate provides a comprehensive environment for DApp development with Hardhat and Solidity, streamlining the
process of smart contract development, testing, and deployment.

## Features

- Smart contract development in Solidity
- Testing framework integration
- Deploy scripts and utility functions

## Prerequisites

- Node.js and npm
- Install Hardhat Shorthand: Run `npm install --global hardhat-shorthand` for easier Hardhat command execution
  using `hh`.

## Setup

1. **Install Dependencies:** Execute `yarn install` to install all necessary dependencies.
2. **Configure Environment:** Copy `.env.example` to `.env` and update with your specific settings.

## Usage with `hh`

- **Compile Contracts:** `hh compile`
- **Run Tests:** `hh test`
- **Clean Artifacts:** `hh clean`

## Available Scripts

- `yarn test`: Execute smart contract tests.
- `yarn lint`: Lint Solidity files.
- `yarn format`: Format code using Prettier.
- `yarn coverage`: Generate test coverage report.
- `yarn deploy:<network>`: Deploy contracts to a specified network.
- `yarn verify:mumbai`: Verify contract on Mumbai network.

## Testing and Deployment

- Test contracts with `Lock.ts`.
- Use `deploy.ts` for deploying contracts and modify as needed.

## Utilities

- `envUtils.ts` includes environment variable management utilities.

## Contributions

Contributions are welcomed following our contribution guidelines.

## License

Licensed under the MIT License.
