# Safe Transaction Verifier

A public good tool to help users verify Safe (Gnosis Safe) transactions before signing or execution.

## Overview

Safe Transaction Verifier is a public good tool developed by Mimir that helps users verify transaction details from any Safe-compatible frontend. It provides an additional security layer by allowing users to independently verify transaction details by pasting the Safe transaction URL.

## Features

- Compatible with all Safe-compatible frontends (not limited to safe.global)
- Parse and decode Safe transaction calldata
- Verify transaction signatures
- Display human-readable transaction details
- Support multiple networks (Ethereum, Polygon, etc.)
- User-friendly interface
- No connection to wallet required

## Usage

1. Visit [safe-tx-verifier.mimir.global](https://safe-tx-verifier.mimir.global)
2. Copy your Safe transaction URL (from any Safe-compatible frontend)
3. Paste the URL into the verifier
4. Review the decoded transaction details
5. Verify signatures and parameters before signing or execution


## Integration for Safe-compatible Multisig Products

Multisig platforms can integrate Safe Transaction Verifier by generating properly formatted URLs with encoded Safe transaction links.

### Direct Integration URL
Use this pattern to create verification links:
`https://safe-tx-verifier.mimir.global/?url={encoded-safe-tx-link}`

Parameter Requirements:
1. `encoded-safe-tx-link`
   - Must be URL-encoded per [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986) standard
   - Should point to any Safe-compatible transaction page (self-hosted or official)

### Example Integration
Sample URL structure:
```bash
https://safe-tx-verifier.mimir.global/?url=https%3A%2F%2Fapp.safe.global%2Ftransactions%2Ftx%3Fsafe%3Deth%3A0x9B2...833%26id%3Dmultisig_0x9B2...f1d
```

JavaScript encoding example:
```javascript
const rawURL = "https://app.safe.global/transactions/tx?safe=eth:0x9B2...833&id=multisig_0x9B2...f1d";
const encodedURL = encodeURIComponent(rawURL);
// Generates: https%3A%2F%2Fapp.safe.global%2Ftransactions%2Ftx%3Fsafe%3Deth%3A0x9B2...833%26id%3Dmultisig_0x9B2...f1d
```
## Deploy Your Own Instance

As a public good, we encourage anyone to deploy their own instance of this verifier:

bash



```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Build for production
yarn build
```

## Security & Decentralization

This tool is:

- Completely open source
- No wallet connection required
- Client-side only
- No data storage

## Roadmap

To ensure maximum decentralization and security:

- Deployment on GitHub Pages
- IPFS hosting
- Support for more Safe-compatible frontends
- Enhanced transaction decoding capabilities

## Why We Built This

Following the Safe front-end attack incident in July 2023, where developer credentials were compromised leading to significant losses, we recognized the need for an independent verification tool. This allows users to double-check their transactions before signing or execution, adding an extra layer of security.

## Support

- Create an issue for bug reports or feature requests
- Follow us on Twitter [@Mimir_global](https://twitter.com/Mimir_global)
- Visit our self-hosted {Safe} service: [safe.mimir.global](https://safe.mimir.global)

## Acknowledgments

- Safe Team
- Mimir Team
- All contributors to this project

Made with ❤️ by Mimir

This is a public good. Feel free to deploy, modify, and share.
