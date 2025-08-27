import json
from mean_var_std import calculate

resultado = calculate([0, 1, 2, 3, 4, 5, 6, 7, 8])
print(json.dumps(resultado, indent=4, separators=(',', ': '), ensure_ascii=False))