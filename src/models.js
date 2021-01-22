'use strict';

/** Class representing an package conflict. */
class ErrorEntry {
  /**
   * Create a ErrorEntry.
   * @param {number} path - The project path.
   * @param {number} nugetPackage - The package name.
   * @param {number} version - The package version.
   */
  constructor(path, nugetPackage, version) {
    this.path = path;
    this.nugetPackage = nugetPackage;
    this.version = version;
  }
}

module.exports = {
  ErrorEntry: ErrorEntry,
};
