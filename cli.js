const fs = require('fs-extra');
const yargs = require('yargs');

const argv = yargs
  .usage('Usage: node src/cli.js [options]')
  .option('open', {
    describe: 'Open a file',
    alias: 'o',
    type: 'string'
  })
  .option('save', {
    describe: 'Save content to a file',
    alias: 's',
    type: 'string'
  })
  .option('content', {
    describe: 'Content to save',
    alias: 'c',
    type: 'string'
  })
  .help('help')
  .alias('help', 'h')
  .argv;

function main() {
  if (argv.open) {
    try {
      const content = fs.readFileSync(argv.open, 'utf-8');
      console.log('File Contents:');
      console.log(content);
    } catch (error) {
      console.error('Error reading file:', error.message);
    }
  }

  if (argv.save) {
    if (!argv.content) {
      console.error('Please provide content to save using -c or --content');
      process.exit(1);
    }

    try {
      fs.writeFileSync(argv.save, argv.content);
      console.log(`File saved successfully to ${argv.save}`);
    } catch (error) {
      console.error('Error saving file:', error.message);
    }
  }

  // If no arguments provided, start an interactive CLI
  if (!argv.open && !argv.save) {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Enter file path to save: ', (filePath) => {
      rl.question('Enter content: ', (content) => {
        try {
          fs.writeFileSync(filePath, content);
          console.log(`File saved successfully to ${filePath}`);
        } catch (error) {
          console.error('Error saving file:', error.message);
        }
        rl.close();
      });
    });
  }
}

main();