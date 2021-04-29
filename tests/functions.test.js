const each = require('jest-each').default;
const functions = require('../src/functions');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

describe('getPackageReference tests', () => {
  const MOCK_FILE_CONTENT_NO_MATCHES = [
    'nothing',
    'nothing',
    'nothing',
  ];

  const MOCK_FILE_CONTENT_MATCHES = [
    'nothing',
    '<PackageReference Include="DevSlice.Net.TokenHandler" ' +
    'Version="2.0.662-Pull6" />',
  ];

  each([
    [MOCK_FILE_CONTENT_NO_MATCHES, []],
    [MOCK_FILE_CONTENT_MATCHES, [{
      nugetPackage: 'DevSlice.Net.TokenHandler',
      path: 'somewhere.proj',
      version: '2.0.662-Pull6',
    }]],
  ]).test('when the file has content of \'%s\'', async (text, expected) => {
    process.env.GITHUB_WORKSPACE = ""
    const createReadStreamSpy = jest.spyOn(fs, 'createReadStream')
        .mockReturnValueOnce('stream');
    const createInterfaceSpy = jest.spyOn(readline, 'createInterface')
        .mockReturnValueOnce(text);
    const result = await functions.getPackageReference('somewhere.proj');

    expect(createReadStreamSpy).toBeCalledWith('somewhere.proj');
    expect(createInterfaceSpy)
        .toBeCalledWith({crlfDelay: Infinity, input: 'stream'});
    expect(result).toEqual(expected);
  });
});

describe('getProjectFilePaths tests', () => {
  const MOCK_FILE_CONTENT_NO_MATCHES = [
    'nothing',
    'nothing',
    'nothing',
  ];

  const MOCK_FILE_CONTENT_MATCHES = [
    'Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = ' +
    '"DevSlice.Net.WebSite.ClientSide", "DevSlice.Net.WebSite.ClientSide\\' +
    'DevSlice.Net.WebSite.ClientSide.csproj", "{30D8841C-\n' +
      '0CBB-47DB-B8CB-FCB5AF7B233E}',
  ];

  each([
    [MOCK_FILE_CONTENT_NO_MATCHES, []],
    [MOCK_FILE_CONTENT_MATCHES, [
      path.join('somewhere', 'DevSlice.Net.WebSite.ClientSide', 
      'DevSlice.Net.WebSite.ClientSide.csproj')]],
  ]).test('when the file has content of \'%s\'', async (text, expected) => {
    const createReadStreamSpy = jest.spyOn(fs, 'createReadStream')
        .mockReturnValueOnce('stream');
    const createInterfaceSpy = jest.spyOn(readline, 'createInterface')
        .mockReturnValueOnce(text);
    const result = await functions
        .getProjectFilePaths('somewhere', 'test.sln');

    expect(createReadStreamSpy).toBeCalledWith(path.join('somewhere','test.sln'));
    expect(createInterfaceSpy)
        .toBeCalledWith({crlfDelay: Infinity, input: 'stream'});
    expect(result).toEqual(expected);
  });
});

describe('getError tests', () => {
  test('when passing an empty string as the value', () => {
    expect(functions.getError('', 'path')).toBeFalsy();
  });

  test('when passing a random string as the value', () => {
    expect(functions.getError('just some random text', 'path')).toBeFalsy();
  });

  test('when passing null as the value', () => {
    expect(functions.getError(null, 'path')).toBeFalsy();
  });

  test('when passing a project ref as the value', () => {
    expect(functions.getError(
        '<PackageReference Include="DevSlice.Net.TokenHandler" ' +
        'Version="2.0.662-Pull6" />',
        'path'))
        .toEqual({
          nugetPackage: 'DevSlice.Net.TokenHandler',
          path: 'path',
          version: '2.0.662-Pull6',
        });
  });
});

describe('getProjectPath tests', () => {
  test('when passing an empty string as the value', () => {
    expect(functions.getProjectPath('')).toBeFalsy();
  });

  test('when passing a random string as the value', () => {
    expect(functions.getProjectPath('just some random text')).toBeFalsy();
  });

  test('when passing null as the value', () => {
    expect(functions.getProjectPath(null)).toBeFalsy();
  });

  test('when passing a project ref as the value', () => {
    expect(functions.getProjectPath('Project("{FAE04EC0-301F-11D3-BF' +
        '4B-00C04F79EFBC}") = "DevSlice.Net.WebSite.ClientSide", "DevSlice' +
        '.Net.WebSite.ClientSide\\DevSlice.Net.WebSite.ClientSide.csproj", ' +
        '"{30D8841C-0CBB-47DB-B8CB-FCB5AF7B233E}'))
        .toEqual('DevSlice.Net.WebSite.ClientSide\\DevSlice.Net.WebSite.ClientSide.csproj'));
  });
});

describe('filterProjectPackageReference tests', () => {
  test('when passing an empty string as the value', () => {
    expect(functions.filterProjectPackageReference('')).toStrictEqual([]);
  });

  test('when passing empty arrays', () => {
    expect(functions.filterProjectPackageReference([[], []]))
        .toStrictEqual([]);
  });

  test('when passing an empty array and one with values', () => {
    expect(functions.filterProjectPackageReference([['test'], []]))
        .toStrictEqual(['test']);
  });
});
