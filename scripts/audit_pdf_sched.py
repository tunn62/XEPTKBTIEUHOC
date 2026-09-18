import json
from collections import defaultdict
from build_full_schedule_from_pdf import sched, CLASSES, GVCN

# 1. Check collisions
collisions = []
teacher_slots = defaultdict(lambda: defaultdict(list))

for sid, class_map in sched.items():
    for cid, (sub, t) in class_map.items():
        teacher_slots[t][sid].append((cid, sub))

for t, slots in teacher_slots.items():
    for sid, classes in slots.items():
        if len(classes) > 1:
            collisions.append((t, sid, classes))

print(f"Total teacher collisions: {len(collisions)}")
for c in collisions:
    print("  Collision:", c)

# 2. Check teacher workload
workloads = {t: sum(len(classes) for classes in slots.values()) for t, slots in teacher_slots.items()}
print("\nTeacher workloads:")
for t in sorted(workloads):
    print(f"  {t}: {workloads[t]} periods")

# 3. Check class workloads
class_workloads = defaultdict(int)
for sid, class_map in sched.items():
    for cid in class_map:
        class_workloads[cid] += 1
print("\nClass workloads:")
for c in sorted(class_workloads):
    print(f"  {c}: {class_workloads[c]} periods")

# 4. Check Quan assignments
print("\nQuan assignments:")
for sid, classes in teacher_slots['Quan'].items():
    print(f"  {sid}: {classes}")
