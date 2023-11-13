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
const fileName = 'test1.txt';
const filePath = path.join(dataDir, fileName);
const fileContents = fs.readFileSync(filePath, 'utf-8');
const lines = fileContents.split('\n');

// 2. build a keyword search index
const index = buildIndex(lines);

// 3. save the index to a file
const indexFilePath = path.join(dataDir, `${fileName}.json`);
fs.writeFileSync(indexFilePath, JSON.stringify(index, null, 2));

// 4. read the index from the file
const indexContents = fs.readFileSync(indexFilePath, 'utf-8');
const indexFromFile = JSON.parse(indexContents);

// 5. search the index for a list of keywords
const keywords = argv.slice(2);

const thesaurus = buildThesaurus();
const searchResult = searchIndex(indexFromFile, keywords, {});
const bestLines = findBestResults(searchResult);

// 6. print the results to the console
if (bestLines.length) {
    let nextLine = 0;
    bestLines.forEach(bestLine => {
        if (bestLine <= nextLine) return;
        console.log(bestLine);
        const previousLine = bestLine;
        nextLine = Math.min(lines.length, bestLine + 3);
        for (let i = previousLine; i <= nextLine; i++) {
            const line = lines[i - 1].trim();
            if (line.length) {
                console.log(`${i}: ${line}`);
            }
        }
    });
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

function buildIndex(lines) {
    const index = {};
    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
        const line = lines[lineNumber];
        const words = line.split(' ').map(word => singularize(cleanWord(word.toLowerCase())));
        words.forEach(word => {
            index[word] = index[word] || [];
            index[word].push(lineNumber + 1);
        });
    }
    return index;
}

function searchIndex(index, keywords, thesaurus) {
    const results = {};
    for (let i = 0; i < keywords.length; i++) {
        const keyword = singularize(cleanWord(keywords[i].toLowerCase()));
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

function findBestResults(results) {
    const candidates = Object.keys(results).map(v => parseInt(v));
    const counts = candidates.map(lineNumber => ({ lineNumber, hitCount: results[lineNumber] })).sort((a, b) => b.hitCount - a.hitCount);
    if (!counts.length) {
        return [];
    }

    let bestResult = counts[0];
    return counts.filter(c => c.hitCount === bestResult.hitCount).map(c => c.lineNumber).sort((a, b) => a - b);
}

function cleanWord(word) {
    return word.replace(/[^a-z0-9]/g, '');
}

function isPlural(word) {
    return word.endsWith('s');
}

function pluralize(word) {
    // if it ends with a consent add es else add s.
    const lastLetter = word => word[word.length - 1];
    switch (lastLetter) {
        case 'a':
        case 'e':
        case 'i':
        case 'o':
        case 'u':
            return word + 's';
        case 'y':
            return word.slice(0, -1) + 'ies';
        default:
            return word + 'es';
    }
}

function singularize(word) {
    if (!isPlural(word)) {
        return word;
    }
    if (word.endsWith('ies')) {
        return word.slice(0, -3) + 'y';
    } else if (word.endsWith('es')) {
        return word.slice(0, -2);
    }
    else if (word.endsWith('s')) {
        return word.slice(0, -1);
    }
    return word;
}