module.exports = {
  default: {
    require: ['features/step_definitions/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'html:cucumber-report.html',
      'json:cucumber-report.json',
      '@cucumber/pretty-formatter'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    publishQuiet: true,
  }
};
