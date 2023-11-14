const fileName = 'test2.txt';

// 1. read the document from the data folder
// 2. build a keyword search index
// 3. save the index to a file
// 4. read the index from the file
// 5. search the index for a list of keywords
// 6. print the results to the console

// 1. read the document from the data folder
const fs = require('fs');
const path = require('path');
const { argv } = require('process');
const dataDir = path.join(__dirname, 'data');
const filePath = path.join(dataDir, fileName);
const fileContents = fs.readFileSync(filePath, 'utf-8');

const lines = fileContents.split('\n');
const stemmer = buildStemmer();
const thesaurus = buildThesaurus();
const blacklist = ["the", "i", "a", "an", "and", "or"];

function cleanWord(word) {
    word = word.toLowerCase();
    word = word.replace(/[^a-z0-9]/g, '');
    word = stemmer[word] || word;
    if (thesaurus[word]) {
        const priorWord = word;
        word = thesaurus[word].join("+");
        console.log(`${priorWord} -> ${word}`);
    }
    return word;
}


// does indexFilePath exist?
const indexFilePath = path.join(dataDir, `${fileName}.json`);
if (!fs.existsSync(indexFilePath)) {

    // 2. build a keyword search index
    const index = buildIndex(lines);

    // 3. save the index to a file
    fs.writeFileSync(indexFilePath, JSON.stringify(index, null, 2));
}

// 4. read the index from the file
const indexContents = fs.readFileSync(indexFilePath, 'utf-8');
const indexFromFile = JSON.parse(indexContents);

// 5. search the index for a list of keywords
const searchPhrase = argv.slice(2);
const keywords = searchPhrase.map(cleanWord).filter(v => !blacklist.includes(v));
console.log(`Searching for "${searchPhrase.join(' ')}"`);
console.log();

const searchResult = searchIndex(indexFromFile, keywords);
const bestLines = findBestResults(searchResult);

// 6. print the results to the console
if (bestLines.length) {
    let nextLine = 0;
    bestLines.forEach(bestLine => {
        const previousLine = Math.max(nextLine + 1, bestLine - 3);
        nextLine = Math.min(lines.length, bestLine + 3);
        for (let i = previousLine; i <= nextLine; i++) {
            const lineNumber = i.toString().padStart(6, ' ');
            const line = lines[i - 1].trim();
            if (line.length) {
                if (i === bestLine) {
                    console.log(`->${lineNumber}: ${line}`);
                } else {
                    console.log(`  ${lineNumber}: ${line}`);
                }
            }
        }
        console.log();
    });
} else {
    console.log('No results found');
}

function buildStemmer() {
    const stemmerContents = fs.readFileSync(path.join(dataDir, 'stemmer.txt'), 'utf-8').split('\n');
    const stemmer = {};
    stemmerContents.forEach(line => {
        const [word, stem] = line.split(':');
        stemmer[word] = stem;
    });
    return stemmer;

}
function buildThesaurus() {
    const thesaurusContents = fs.readFileSync(path.join(dataDir, 'reverse-thesaurus.json'), 'utf-8');
    return JSON.parse(thesaurusContents);
}

function buildIndex(lines) {
    const index = {};
    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
        const line = lines[lineNumber];
        const words = new Set();
        line.split(' ').forEach(word => words.add(cleanWord(word)));
        words.forEach(word => {
            index[word] = index[word] || [];
            index[word].push(lineNumber + 1);
        });
    }
    return index;
}

function searchIndex(index, keywords) {
    const results = {};
    keywords.forEach(keyword => {
        if (keyword) {
            const lines = index[keyword];
            if (!lines) {
                console.log(`Keyword not found: ${keyword}`);
                return;
            }
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
    });
    return results;
}

function findBestResults(results) {
    const candidates = Object.keys(results).map(v => parseInt(v));
    const counts = candidates.map(lineNumber => ({ lineNumber, hitCount: results[lineNumber] })).sort((a, b) => b.hitCount - a.hitCount);
    if (!counts.length) {
        return [];
    }

    let bestResult = counts[0];
    return counts.filter(c => c.hitCount === bestResult.hitCount).map(c => c.lineNumber).sort((a, b) => a - b);
}

