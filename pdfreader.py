import sys
import tabula

if len(sys.argv) < 2:
    print("Usage: python script.py <pdf_file_path>")
    sys.exit(1)

pdf_path = sys.argv[1]

try:
    dfs = tabula.read_pdf(pdf_path, pages='all')
except Exception as e:
    print(f"Error while reading PDF file: {e}")
    sys.exit(1)

for i in range(len(dfs)):
    dfs[i].to_csv(f"./server/controllers/table_{i}.csv")

print(f"{len(dfs)} tables extracted from PDF.")

# dfs[0].to_csv("./server/controllers/first_table.csv")
# tabula.convert_into(pdf_path, "first_tablex.csv", output_format="csv", pages='1')