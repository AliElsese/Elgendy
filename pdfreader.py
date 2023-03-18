# print('hi from python')

import sys
import tabula

pdf_path = './ex2.pdf'

dfs = tabula.read_pdf(pdf_path, pages='all')

print(len(dfs))
dfs[0].to_csv("./server/controllers/first_table.csv")
# tabula.convert_into(pdf_path, "first_tablex.csv", output_format="csv", pages='1')