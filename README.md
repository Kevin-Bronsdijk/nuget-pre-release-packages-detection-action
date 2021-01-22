# nuget-pre-release-packages-detection-action


# GitHub Action which detects pre-release Nuget packages

This action detects detects pre-release Nuget packages for all projects linked to a given solution file.

## Inputs

### `solution-file-name`

**Required** The name of the solution file. Example `"solution.sln"`.

### `solution-path`

**Required** The directory where the solution solution file exists.

## Outputs

### `found-prerelease`

Indicator if a pre-release was found, true or false. 

## Example usage

uses: kevin-bronsdijk/nuget-pre-release-packages-detection-action@v1.1
with:
  solution-file-name: 'devslice.sln'
  solution-path: '/home/'
  
