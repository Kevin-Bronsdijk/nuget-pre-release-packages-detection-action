# Nuget pre-release packages check

## What is it?

This action detects pre-release NuGet packages for all projects linked to a given solution file. Pre-release packages are often Alpha packages only to be used when developing however avoided when running production code. 

<a href="https://github.com/Kevin-Bronsdijk/nuget-pre-release-packages-detection-action/actions"><img alt="javscript-action status" src="https://github.com/Kevin-Bronsdijk/nuget-pre-release-packages-detection-action/workflows/Main%20package%20ncc%20build/badge.svg"></a>

## How to use it?

### Configure the GitHub action

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

# Contact and bug reports

Feel free to open an issue on this GitHub project.

