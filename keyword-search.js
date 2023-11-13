// 1. read the test1.txt file in the data folder
// 2. build a keyword search index
// 3. save the index to a file
// 4. read the index from the file
// 5. search the index for a list of keywords
// 6. print the results to the console

// 1. read the test1.txt file in the data folder
const fs = require('fs');
const path = require('path');
const { argv } = require('process');
const dataDir = path.join(__dirname, 'data');
const fileName = 'test2.txt';
const filePath = path.join(dataDir, fileName);
const fileContents = fs.readFileSync(filePath, 'utf-8');

// 2. build a keyword search index
const index = buildIndex(fileContents);

// 3. save the index to a file
const indexFilePath = path.join(dataDir, `${fileName}.json`);
fs.writeFileSync(indexFilePath, JSON.stringify(index));

// 4. read the index from the file
const indexContents = fs.readFileSync(indexFilePath, 'utf-8');
const indexFromFile = JSON.parse(indexContents);

// 5. search the index for a list of keywords
const keywords = argv.slice(2);

const thesaurus = buildThesaurus();
const searchResult = searchIndex(indexFromFile, keywords, thesaurus);
const bestLine = findBestResult(searchResult);

// 6. print the results to the console
if (bestLine) {
    console.log(bestLine);
    const lines = fileContents.split('\n');
    const previousLine = Math.max(1, bestLine - 1);
    const nextLine = Math.min(lines.length, bestLine + 1);
    for (let i = previousLine; i <= nextLine; i++) {
        const line = lines[i - 1];
        console.log(`${i}: ${line}`);
    }
} else {
    console.log('No results found');
}

function buildThesaurus() {
    const thesaurusContents = fs.readFileSync(path.join(dataDir, 'thesaurus.txt'), 'utf-8').split('\n');
    const thesaurus = {};
    thesaurusContents.forEach(line => {
        const words = line.split(',');
        const word = words[0];
        const synonyms = words.slice(1);
        thesaurus[word] = synonyms;
    });
    return thesaurus;
}

function buildIndex(fileContents) {
    const lines = fileContents.split('\n');
    const index = {};
    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
        const line = lines[lineNumber];
        const words = line.split(' ').map(word => cleanWord(word.toLowerCase()));
        for (let j = 0; j < words.length; j++) {
            const word = words[j].toLowerCase();
            if (!index[word]) {
                index[word] = [];
            }
            index[word].push(lineNumber + 1);
        }
    }
    return index;
}

function searchIndex(index, keywords, thesaurus) {
    const results = {};
    for (let i = 0; i < keywords.length; i++) {
        const keyword = keywords[i].toLowerCase();
        const synonyms = (thesaurus[keyword] || []);
        if (!synonyms.length) {
            console.warn(`check spelling of "${keyword}"`);
        }
        const words = [keyword, ...synonyms];
        const word = words.find(word => !!index[word]);
        if (word) {
            if (keyword !== word) {
                console.log(`${keyword} -> ${word}`);
            }
            const lines = index[word];
            lines.forEach(line => {
                if (line > 0) {
                    results[line - 1] = (results[line - 1] || 0) + 1;
                }
                if (line < lines.length - 1) {
                    results[line + 1] = (results[line + 1] || 0) + 1;
                }
                results[line] = (results[line] || 0) + 2;
            })
        }
    }
    return results;
}

function findBestResult(results) {
    let bestResult = 0;
    let bestLine = 0;
    for (let line in results) {
        const count = results[line];
        if (count > bestResult) {
            bestResult = count;
            bestLine = parseInt(line);
        }
    }
    return bestLine;
}

function cleanWord(word) {
    return word.replace(/[^a-z0-9]/g, '');
}