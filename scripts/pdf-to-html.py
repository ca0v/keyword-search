# this script accepts the path to a PDF file as an argument
# it converts the PDF to markdown
# then it writes the markdown to the console


import sys
from pdf2docx import Converter

# first, read get the path to the PDF file
pathToPdf = sys.argv[1]
print(pathToPdf)

# next, convert the PDF to markdown
# this is done by converting the PDF to HTML
# then converting the HTML to markdown

# convert the PDF to DOC
pdf_file = pathToPdf
docx_file = 'output.docx'
cv = Converter(pdf_file)
cv.convert(docx_file, start=0, end=None)
cv.close()

