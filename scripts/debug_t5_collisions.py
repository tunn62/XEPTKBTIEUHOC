import sys
sys.path.append('scripts')
from test_raw_table import raw_table, CLASSES, GVCN
import re

# Let's inspect the 9 collisions from raw_table:
# 1. ('T4_C_3', 'Thịnh', '2B', '5B', 'GDTC')
# 2. ('T5_S_4', 'Nương', '4A', '3B', 'TA')
# 3. ('T5_C_1', 'Tâm', '1A', '5A', 'BDAN')
# 4. ('T5_C_1', 'Nương', '4A', '4B', 'TA')
# 5. ('T5_C_2', 'Nhàn', '1A', '1B', 'TCT')
# 6. ('T5_C_2', 'Nương', '3B', '5B', 'TA')
# 7. ('T5_C_3', 'Thịnh', '3A', '5A', 'GDTC')
# 8. ('T5_C_3', 'Thịnh', '3A', '1B', 'GDTC')
# 9. ('T5_C_3', 'Nhàn', '2A', '2B', 'TCT')

# Notice that almost all collisions are on Thursday (T5)!
# Why did Thursday have collisions? Let's print raw_table['T5_S_4'], raw_table['T5_C_1'], raw_table['T5_C_2'], raw_table['T5_C_3']
for sid in ['T4_C_3', 'T5_S_4', 'T5_C_1', 'T5_C_2', 'T5_C_3']:
    print(sid, ':')
    for cid, cell in zip(CLASSES, raw_table[sid]):
        print(f"  {cid}: {cell}")
