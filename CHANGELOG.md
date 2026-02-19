# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.16] - 2025-02-19

### Changed
- Updated dependencies to latest within major versions

### Fixed
- Updated exports to include validation functions

## [0.4.15] - 2025-02-09

### Changed
- Bumped version for npm publish

### Fixed
- Fixed Vite security vulnerability

### Refactored
- Updated build configuration for better ESM/CJS compatibility

## [0.4.14] - 2025-01-15

### Added
- NIP-19 support and updated dependencies

### Changed
- Improved types and NIP support

## [0.4.13] - 2025-01-10

### Added
- Improved NIP-19 documentation and exports

## [0.4.12] - 2025-01-05

### Fixed
- Improved TypeScript type handling and browser compatibility
- Removed unused imports

## [0.4.11] - 2025-01-03

### Changed
- Updated dist files after build cleanup
- Fixed linting issues and removed unused imports

## [0.4.10] - 2025-01-02

### Fixed
- Corrected crypto module exports path for better ESM compatibility
- Fixed directory imports for Node.js ESM

## [0.4.9] - 2025-01-02

### Fixed
- Enhanced Node.js compatibility with proper CJS/ESM module support
- Improved module resolution for both CommonJS and ES Module environments
- Fixed package exports to ensure consistent behavior across different Node.js versions

## [0.4.5] - 2024-12-29

### Fixed
- Fixed NIP-19 function exports to ensure proper access from dependent packages
- Improved type exports for NIP-19 related types
- Updated documentation for NIP-19 functionality with clearer examples

## [0.4.4] - 2024-12-29

### Added
- Enhanced logging system with comprehensive error handling
- Development mode pretty printing with timestamps
- TypeScript type exports for logger
- Export utility functions: `encodeBytes` and `getPublicKeyHex`

### Changed
- Updated logger implementation to follow project-wide standards
- Improved error object formatting with stack traces
- Enhanced development mode output formatting

## [0.4.3] - 2024-12-29

### Added
- Enhanced logging system with comprehensive error handling
- Development mode pretty printing with timestamps
- TypeScript type exports for logger
- Export utility functions: `encodeBytes` and `getPublicKeyHex`

### Changed
- Updated logger implementation to follow project-wide standards
- Improved error object formatting with stack traces
- Enhanced development mode output formatting
- Removed unused code and variables

### Fixed
- Error object serialization in logs now includes stack traces
- Development mode logging now properly handles timestamps
- Resolved lint issues in nip-19, nip-26, and validation utilities

## [0.4.2] - Previous Release
... (previous entries)
