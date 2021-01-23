# Nuget pre-release packages check

This action detects pre-release NuGet packages for all projects linked to a given solution file. Pre-release packages are often Alpha packages only to be used when developing however avoided when running production code. 

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Inputs

### `solution-file-name`

**Required** The name of the solution file. Example `"solution.sln"`.

### `solution-path`

**Required** The directory where the solution solution file exists.

## Outputs

### `found-pre-release`

Boolean indicator used to tell that a pre-release packages was found.

## Example usage

```yml

jobs:
    precheck:
        runs-on: ubuntu-latest
        steps:
            - uses: kevin-bronsdijk/nuget-pre-release-packages-detection-action@v2.0
              id: nugetprerelease
              with:
                  solution-file-name: 'devslice.sln'
                  solution-path: '/home/'
            - run: echo "result ${{ steps.nugetprerelease.outputs.found-pre-release }}"
```
