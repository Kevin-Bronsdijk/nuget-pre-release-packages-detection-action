'use strict';

const fs = require('fs');
const readline = require('readline');
const {ErrorEntry} = require('./models');

const getProjectPathFromRawValue = (value) => {
  if (!value) {
    return value;
  }
  const x = value.split('"');
  const result = x.filter(function(item) {
    return typeof item === 'string' && item.indexOf('csproj') > -1;
  });

  return result[0];
};

const getErrorEntryFromRawValue = (value, path) => {
  if (!value) {
    return value;
  }

  const nodesSdk = 5;
  const versionNode = 3;
  const packageNode = 1;
  const nodes = value.split('"');

  if (nodes.length === nodesSdk && nodes[versionNode].indexOf('-') != -1) {
    return new ErrorEntry(path, nodes[packageNode], nodes[versionNode]);
  }
};

const getPathsContainingAProjectFile = async (path, solutionName) => {
  const fileStream = fs.createReadStream(`${path}${solutionName}`);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const projects = [];
  for await (const line of rl) {
    if (line.includes('csproj')) {
      projects.push(getProjectPathFromRawValue(line));
    }
  }

  return projects.map((x) => {
    return `${path}${x}`;
  });
};

const getPackageReference = async (path) => {
  const fileStream = fs.createReadStream(`${path}`);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const errors = [];
  for await (const line of rl) {
    if (line.includes('PackageReference')) {
      const error = getErrorEntryFromRawValue(line, path);
      if (error) errors.push(error);
    }
  }

  return errors;
};

module.exports = {
  getProjectPath: getProjectPathFromRawValue,
  getError: getErrorEntryFromRawValue,
  getProjectFilePaths: getPathsContainingAProjectFile,
  getPackageReference,
};
