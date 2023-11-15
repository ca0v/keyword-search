# read a pdf file and convert it to text
# dump the text to the console

import sys

pdfFile = sys.argv[1]

import pdfplumber

with pdfplumber.open(pdfFile) as reader:
    for page in reader.pages:
        print(page.extract_text())
