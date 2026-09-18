import json
from collections import defaultdict
from build_full_schedule_from_pdf import sched, CLASSES, GVCN

# Let's inspect Thursday (T5_S and T5_C) in detail
t5_slots = ['T5_S_1', 'T5_S_2', 'T5_S_3', 'T5_S_4', 'T5_C_1', 'T5_C_2', 'T5_C_3']
print("Current Thursday slots:")
for sid in t5_slots:
    print(sid)
    for c in CLASSES:
        sub, t = sched[sid][c]
        print(f"  {c}: {sub} ({t})")
