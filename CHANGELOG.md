# Changelog 

## [2.1.0] - 2022-10-04

### Major changes

- Development by @mugiwarafx in https://github.com/international-accessibility-task-force/iatf-bot/pull/15
- update pipeline by @mugiwarafx in https://github.com/international-accessibility-task-force/iatf-bot/pull/16
- run with ts-node by @mugiwarafx in https://github.com/international-accessibility-task-force/iatf-bot/pull/17
- express t by @mugiwarafx in https://github.com/international-accessibility-task-force/iatf-bot/pull/18
- v2.1.0 by @mugiwarafx in https://github.com/international-accessibility-task-force/iatf-bot/pull/19


**Full Changelog**: https://github.com/international-accessibility-task-force/iatf-bot/compare/v2.0.1...v2.1.0

## [2.0.0] - 2022-09-13

An attempt to make the code more object-oriented and shortly event-based as well. The readability of the code has increased. The lengthy of the code has decreased.

### Major changes
- Added class `Bot`
- Added Bot methods `channelClear`, `channelClearBotOnly`, and `awaitingVerification`
- Removed index.js spaghetti code

### Changed features
- Moved `server.js` to `utils/server.js`
- Moved `index.js` to `main.js`

### New features
- Added `@babel/eslint-parser ^7.19.1`
- Added `@babel/preset-env ^7.19.1`
- Added `eslint ^8.23.1`
- Added `.eslintignore`
- Added `.eslintrc.js`
- Added `_/rollback.js`

### Discord server changes:

- Everyone can see all channels
- #server-introduction is filtered manually. Admins must verify an introduction manually. Once an introduction is verified, you can speak in all the server channels regardless of your roles
- Provide an alternative to get verified without using the server-introductions channel
- Security improvements related to external emojis, external files, and embeds are now fixed