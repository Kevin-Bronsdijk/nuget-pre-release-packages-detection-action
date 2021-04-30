'use strict';

const core = require('@actions/core');
const {
  getProjectFilePaths,
  getPackageReference,
  filterProjectPackageReference} = require('./functions');

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
  // `ignore-failure` input defined in action metadata file
  const ignoreFailure = core.getInput('ignore-failure') || false;

  console.log(`solution-file-name ${solutionFileName}`);
  console.log(`solution-path ${solutionPath}`);

  const projectPaths =
      await getProjectFilePaths(solutionPath, solutionFileName);

  const projectPackageReference =
      await getProjectPackageReference(projectPaths);

  const packageReferenceIssues =
      filterProjectPackageReference(projectPackageReference);

  if (packageReferenceIssues.length > 0) {
    const packageList = packageReferenceIssues.join('\n');
    console.log(`list of pre-release packages found`, packageList);
    core.setOutput('found-pre-release', true);
    if (!ignoreFailure) {
      core.setFailed('Found pre-release packages:\n' + packageList);
    }
  } else {
    core.setOutput('found-pre-release', false);
  }
};

main().catch((err) => core.setFailed(err.message));
