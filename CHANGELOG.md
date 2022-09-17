# Changelog
All notable changes to this project will be documented in this file.

## [8.4.5] - 2022-09-17

### Added 
- Displayed colorful warning messgess in case of no headings found or no element at the given selector `getFrom`.

### Changed
- In `bag.$` and `bag.$$` functions then 2nd argument(which is the element to look within) is made mandatory.

### Fixed
- Fixed memory leak. Now it runs smooth in React.
