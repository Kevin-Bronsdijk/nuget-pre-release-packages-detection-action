'use strict';

const core = require('@actions/core');
const {getProjectFilePaths, getPackageReference} = require('./functions');

const getProjectPackageReference = async (projectPaths) => {
  return Promise.all(projectPaths.map((x) => {
    return getPackageReference(x);
  }));
};

const main = async () => {
  // `solution-file-name` input defined in action metadata file
  const solutionFileName = core.getInput('solution-file-name');
  // `solution-path` input defined in action metadata file
  const solutionPath = core.getInput('solution-path');

  console.log(`solution-file-name ${solutionFileName}`);
  console.log(`solution-path ${solutionPath}`);

  const projectPaths =
      await getProjectFilePaths(solutionPath, solutionFileName);

  getProjectPackageReference(projectPaths).then((packageErrors) => {
    console.log(packageErrors.filter((e) => e != null), projectPaths);
  });

  core.setOutput('found-prerelease', false);
};

main().catch((err) => core.setFailed(err.message));
