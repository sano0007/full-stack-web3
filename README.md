# Web 3.0 Full Stack App

This project is a full stack Web 3.0 application that leverages Solidity, Ethereum, Hardhat, and React to provide a decentralized platform for real estate transactions. It consists of two main parts: the backend (smart contracts) and the frontend application.

## Overview

The backend is built with Solidity smart contracts, deployed on the Ethereum network using Hardhat. It includes contracts for handling escrow mechanisms and real estate transactions. The frontend is a React application that interacts with the deployed smart contracts, allowing users to view, list, and transact real estate properties in a decentralized manner.

### Backend

The backend directory contains the Solidity smart contracts, Hardhat configuration, deployment scripts, and tests for the application.

- **Contracts**: `Escrow.sol` for handling the escrow mechanism and `RealEstate.sol` for managing real estate properties.
- **Hardhat**: Configuration files for deploying and testing the contracts.
- **Scripts**: Deployment scripts for deploying the contracts to the Ethereum network.
- **Tests**: Unit tests for the smart contracts.

#### Getting Started

To set up and run the backend:

1. Navigate to the `backend` directory.
2. Install dependencies with `yarn install`.
3. Compile the smart contracts with `yarn hardhat compile`.
4. Run tests with `yarn test`.
5. Deploy the contracts to a network (e.g., Ropsten) with `yarn hardhat run scripts/deploy.js --network ropsten`.

### Frontend

The frontend is a React application that provides a user interface for interacting with the smart contracts. It includes components for listing properties, initiating transactions, and viewing the status of transactions.

- **Components**: React components for different parts of the application.
- **ABIs**: ABI files for the smart contracts to interact with them from the frontend.
- **Assets**: Images and other static resources used in the application.

#### Getting Started

To set up and run the frontend:

1. Navigate to the `frontend` directory.
2. Install dependencies with `yarn install`.
3. Start the development server with `yarn dev`.
4. Build the application for production with `yarn build`.

## Requirements

- Node.js
- Yarn
- An Ethereum wallet like MetaMask
- An Infura or Alchemy API key for deploying contracts

## License

This project is licensed under the MIT License - see the `LICENSE` file in the backend directory for details.
