'use strict';

const fs = require('fs');
const path = require('path')
const readline = require('readline');
const {ErrorEntry} = require('./models');

const filterProjectPackageReference = (projectPackageReferences) => {
  if (!projectPackageReferences) {
    return [];
  }

  let allProjectPackageReferences = [];
  projectPackageReferences.forEach(function(packageReference) {
    if (packageReference.length > 0) {
      allProjectPackageReferences = allProjectPackageReferences.concat(packageReference);
    }
  });

  return allProjectPackageReferences;
};

const getProjectFileNameFromRawValue = (value) => {
  if (!value) {
    return value;
  }
  const x = value.split('"');
  const result = x.filter(function(item) {
    return typeof item === 'string' && item.indexOf('csproj') > -1;
  });

  return result[0];
};

const getErrorEntryFromRawValue = (value, filepath) => {
  if (!value) {
    return value;
  }

  const nodesSdk = 5;
  const versionNode = 3;
  const packageNode = 1;
  const nodes = value.split('"');

  if (nodes.length === nodesSdk && nodes[versionNode].indexOf('-') != -1) {
    return new ErrorEntry(filepath, nodes[packageNode], nodes[versionNode]);
  }
};

const getPathsContainingAProjectFile = async (solutionDir, solutionName) => {
  const solutionPath = path.join(process.env.GITHUB_WORKSPACE, solutionDir, solutionName)
  const fileStream = fs.createReadStream(solutionPath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const projects = [];
  for await (const line of rl) {
    if (line.includes('csproj')) {
      projects.push(getProjectFileNameFromRawValue(line));
    }
  }

  return projects.map((projectFileName) => {
    return path.join(process.env.GITHUB_WORKSPACE, solutionDir, projectFileName);
  });
};

const getPackageReference = async (projectPath) => {
  const fileStream = fs.createReadStream(projectPath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const errors = [];
  for await (const line of rl) {
    if (line.includes('PackageReference')) {
      const error = getErrorEntryFromRawValue(line, projectPath);
      if (error) errors.push(error);
    }
  }

  return errors;
};

module.exports = {
  getProjectPath: getProjectFileNameFromRawValue,
  getError: getErrorEntryFromRawValue,
  getProjectFilePaths: getPathsContainingAProjectFile,
  getPackageReference,
  filterProjectPackageReference,
};
