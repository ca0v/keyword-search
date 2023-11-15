# read a pdf file and convert it to text
# dump the text to the console

import sys

pdfFile = sys.argv[1]

# convert the pdf to text
from PyPDF2 import PdfReader

reader = PdfReader(pdfFile)

# print every page
pageNumber = 1
for page in reader.pages:
    # print page number
    # print("Page", pageNumber)
    pageNumber += 1
    print(page.extract_text())
    