"use strict";

const path = require("path");
const minimatch = require("minimatch");
// const mem = require("mem");

const resolve = require("./resolve.js");

const cosmiconfigDict = {
  cosmiconfig: require("cosmiconfig").cosmiconfig,
  cosmiconfigSync: require("cosmiconfig").cosmiconfigSync,
};

/**
 * @typedef {import("cosmiconfig/dist/Explorer").Explorer} Explorer
 * @typedef {{sync: boolean; cache: boolean }} Options
 */

/**
 * @type {(opts: Options) => Explorer}
 */
const getExplorerMemoized = (opts) => {
  const cosmiconfig =
    cosmiconfigDict["cosmiconfig" + (opts.sync ? "Sync" : "")];
  const explorer = cosmiconfig("generateApi", {
    cache: opts.cache,
    transform: (result) => {
      if (result && result.config) {
        if (typeof result.config === "string") {
          const dir = path.dirname(result.filepath);
          const modulePath = resolve(result.config, { paths: [dir] });
          result.config = require(modulePath);
        }

        if (typeof result.config !== "object") {
          throw new Error(
            "Config is only allowed to be an object, " +
              `but received ${typeof result.config} in "${result.filepath}"`
          );
        }

        delete result.config.$schema;
      }
      return result;
    },
    searchPlaces: ["package.json", "generateApi.config.js"],
  });

  return explorer;
};

/**
 * @param {Options} opts
 * @return {Explorer}
 */
function getExplorer(opts) {
  // Normalize opts before passing to a memoized function
  opts = { sync: false, cache: false, ...opts };
  return getExplorerMemoized(opts);
}

function _resolveConfig(filePath, opts, sync) {
  opts = { useCache: true, ...opts };
  const loadOpts = {
    cache: Boolean(opts.useCache),
    sync: Boolean(sync),
  };
  const { load, search } = getExplorer(loadOpts);

  const arr = [opts.config ? load(opts.config) : search(filePath)];

  const unwrapAndMerge = ([result]) => {
    const merged = {
      ...mergeOverrides(result, filePath),
    };

    for (const optionName of ["plugins", "pluginSearchDirs"]) {
      if (Array.isArray(merged[optionName])) {
        merged[optionName] = merged[optionName].map((value) =>
          typeof value === "string" && value.startsWith(".") // relative path
            ? path.resolve(path.dirname(result.filepath), value)
            : value
        );
      }
    }

    if (!result) {
      return null;
    }

    // We are not using this option
    delete merged.insertFinalNewline;
    return merged;
  };

  if (loadOpts.sync) {
    return unwrapAndMerge(arr);
  }

  return Promise.all(arr).then(unwrapAndMerge);
}

const resolveConfig = (filePath, opts) => _resolveConfig(filePath, opts, false);

resolveConfig.sync = (filePath, opts) => _resolveConfig(filePath, opts, true);

async function resolveConfigFile(filePath) {
  const { search } = getExplorer({ sync: false });
  const result = await search(filePath);
  return result ? result.filepath : null;
}

resolveConfigFile.sync = (filePath) => {
  const { search } = getExplorer({ sync: true });
  const result = search(filePath);
  return result ? result.filepath : null;
};

function mergeOverrides(configResult, filePath) {
  const { config, filepath: configPath } = configResult || {};
  const { overrides, ...options } = config || {};
  if (filePath && overrides) {
    const relativeFilePath = path.relative(path.dirname(configPath), filePath);
    for (const override of overrides) {
      if (
        pathMatchesGlobs(
          relativeFilePath,
          override.files,
          override.excludeFiles
        )
      ) {
        Object.assign(options, override.options);
      }
    }
  }

  return options;
}

// Based on eslint: https://github.com/eslint/eslint/blob/master/lib/config/config-ops.js
function pathMatchesGlobs(filePath, patterns, excludedPatterns = []) {
  const patternList = Array.isArray(patterns) ? patterns : [patterns];
  const excludedPatternList = Array.isArray(excludedPatterns)
    ? excludedPatterns
    : [excludedPatterns];
  const opts = { matchBase: true, dot: true };

  return (
    patternList.some((pattern) => minimatch(filePath, pattern, opts)) &&
    !excludedPatternList.some((excludedPattern) =>
      minimatch(filePath, excludedPattern, opts)
    )
  );
}

module.exports = {
  resolveConfig,
  resolveConfigFile,
  //   clearCache,
};
