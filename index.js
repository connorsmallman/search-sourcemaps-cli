const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv
const SourceMapConsumer = require('source-map').SourceMapConsumer;

function readFile(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', function fsReadFile(err, contents) {
            if (err) {
                reject(err);
            }

            resolve(contents);
        });
    })
}

async function main() {
    if (!argv.hasOwnProperty('file')) {
        throw Error('Please include the sourcemap file to search, --file=./my-sourcemap.js.map')
    }

    if (!argv.hasOwnProperty('line')) {
        throw Error('Please include the line number you want to search, --line=1')
    }

    if (!argv.hasOwnProperty('column')) {
        throw Error('Please include the column number you want to search, --column=1')
    }

    try {
        const file = path.join(__dirname, argv.file);

        const rawSourceMap = await readFile(file);
        const consumer = await new SourceMapConsumer(rawSourceMap);
    
        const originalPosition = consumer.originalPositionFor({
            line: argv.line,
            column: argv.column
        });

        console.log(originalPosition);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

main();