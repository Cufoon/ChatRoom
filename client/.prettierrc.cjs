module.exports = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  quoteProps: 'as-needed',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  requirePragma: false,
  insertPragma: false,
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'css',
  endOfLine: 'lf',
  embeddedLanguageFormatting: 'auto',
  singleAttributePerLine: false,
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'none',
  vueIndentScriptAndStyle: true,
  overrides: [
    {
      files: '.prettierrc',
      options: {
        parser: 'json'
      }
    },
    {
      files: '.stylelintrc',
      options: {
        parser: 'json'
      }
    }
  ]
};
