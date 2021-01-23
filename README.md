# GitHub Action which detects pre-release Nuget packages

This action detects detects pre-release Nuget packages for all projects linked to a given solution file.

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Inputs

### `solution-file-name`

**Required** The name of the solution file. Example `"solution.sln"`.

### `solution-path`

**Required** The directory where the solution solution file exists.

## Outputs

### `found-prerelease`

Indicator if a pre-release was found, true or false. 

## Example usage


```yml

jobs:
    precheck:
        runs-on: ubuntu-latest
        steps:
            - uses: kevin-bronsdijk/nuget-pre-release-packages-detection-action@v2.0
              with:
                  solution-file-name: 'devslice.sln'
                  solution-path: '/home/'
```
  
