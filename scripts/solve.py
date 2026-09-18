import json

with open('scripts/free_slots.json') as f:
    free_slots = json.load(f)

print(f"Loaded {len(free_slots)} free slots")

# Group free slots by class
slots_by_class = {}
for s in free_slots:
    cid = s['classId']
    if cid not in slots_by_class:
        slots_by_class[cid] = []
    slots_by_class[cid].append(s)

for cid, slots in slots_by_class.items():
    print(f"Class {cid}: {len(slots)} free slots")
