import json
from collections import defaultdict

with open('scripts/free_slots.json') as f:
    free_slots = json.load(f)

print("Free slots count:", len(free_slots))

# Check morning free slots in Campus 1
c1_morning = [s for s in free_slots if s['campus'] == 'diem1' and s['session'] == 'S']
print("Campus 1 morning free slots:")
for s in c1_morning:
    print(f"  {s['classId']}: {s['slotId']} (Day {s['day']}, Period {s['period']})")
