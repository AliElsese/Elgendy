import sys
import tabula

pdf_path = sys.argv[1]

dfs = tabula.read_pdf(pdf_path, pages='all')

for i in range(len(dfs)):
    dfs[i].to_csv(f"./server/controllers/table_{i}.csv")

print(len(dfs))

# dfs[0].to_csv("./server/controllers/first_table.csv")
# tabula.convert_into(pdf_path, "first_tablex.csv", output_format="csv", pages='1')