# Changelog

## v1.5.1
- Fixed transaction numbers being consumed every time an existing transaction was edited
- Preserved the original transaction number and revision counter during edits
- Committed sequence numbers only when a new transaction is actually saved
- Added a one-time sequence migration to repair legacy gaps caused by edit operations
- Added regression tests for edit and new-transaction numbering

## v1.5.0
- Added reusable and testable core business-logic module
- Added unit tests for largest remainder, amount limits, transaction sequence, and CSV sanitization
- Added GitHub Actions CI for syntax checks and unit tests
- Added a digital-receipt screenshot and expanded project documentation
- Documented architecture, usage, testing, privacy, and local-first limitations

## v1.4.0
- Removed unused `precision.css` and obsolete logo selector overrides
- Synchronized project structure and README with the current source
- Added transaction editing with optional reasons and revision markers
- Prevented transaction-number collisions after sequence reset
- Added excessive-discount and invalid-transaction protection
- Added safe amount limits and large-number layout protection
- Added PNG receipt text wrapping and safer CSV export
- Applied the official DK SHOP logo consistently
- Improved receipt-logo loading and PNG download reliability

## Final Portfolio Edition
- Added portfolio landing hero and feature overview
- Added demo data loader
- Added transaction analytics
- Added transaction status workflow
- Added history status filter and sorting
- Added safer local transaction-number reset
- Improved payment method behavior for Cash
- Improved accessibility labels and responsive layout
- Improved print and PNG receipt metadata
- Added Open Graph metadata for social sharing
- Preserved smart split, LocalStorage, CSV, history, print, and digital receipt features
