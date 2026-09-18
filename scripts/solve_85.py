import json
from collections import defaultdict

with open('scripts/problem_data.json') as f:
    data = json.load(f)

fixed_sched = data['fixedSched']
free_slots = data['freeSlots']

# Required items per class: list of (subject, teacher)
reqs = {
    '1A': [('AN', 'Tâm'), ('BD_AN', 'Tâm'), ('MT', 'Thy'), ('BD_MT', 'Thy'),
           ('TC', 'Phước'), ('TC', 'Phước'), ('TC', 'Phước'), ('TC', 'Phước'),
           ('TC', 'Quan'), ('TC', 'Quan')],
    '2A': [('AN', 'Tâm'), ('BD_AN', 'Tâm'), ('MT', 'Thy'), ('BD_MT', 'Thy'),
           ('TC', 'Phước'), ('TC', 'Phước'), ('TC', 'Phước'), ('TC', 'Phước'),
           ('TC', 'Quan'), ('TC', 'Quan'), ('TC', 'Quan'), ('TC', 'Phước')],
    '3A': [('AN', 'Tâm'), ('BD_AN', 'Tâm'), ('MT', 'Thy'), ('BD_MT', 'Thy'),
           ('HDTN_CD', 'Thy'), ('TC', 'Phước'), ], # 6 slots
    '4A': [('AN', 'Tâm'), ('BD_AN', 'Tâm'), ('MT', 'Thy'), ('BD_MT', 'Thy'),
           ('TC', 'Phước'), ('TC', 'Phước')], # 6 slots
    '5A': [('AN', 'Tâm'), ('BD_AN', 'Tâm'), ('MT', 'Thy'), ('BD_MT', 'Thy'),
           ('HDTN_CD', 'Thy'), ('TC', 'Phước'), ('TC', 'Quan')], # 7 slots

    '1B': [('AN', 'Tâm'), ('BD_AN', 'Tâm'), ('MT', 'Thy'), ('BD_MT', 'Thy'),
           ('TC', 'Phước'), ('TC', 'Phước'),
           ('TC', 'Nhàn'), ('TC', 'Nhàn'), ('TC', 'Nhàn'), ('TC', 'Nhàn'), ('TC', 'Nhàn'), ('HDTN_CD', 'Nhàn')], # 12 slots
    '2B': [('AN', 'Tâm'), ('BD_AN', 'Tâm'), ('MT', 'Thy'), ('BD_MT', 'Thy'),
           ('TC', 'Phước'), ('TC', 'Phước'),
           ('TC', 'Nhàn'), ('TC', 'Nhàn'), ('TC', 'Nhàn'), ('TC', 'Nhàn'), ('HDTN_CD', 'Nhàn')], # 11 slots
    '3B': [('AN', 'Tâm'), ('BD_AN', 'Tâm'), ('MT', 'Thy'), ('BD_MT', 'Thy'),
           ('TC', 'Phước'), ('TC', 'Nhàn'), ('HDTN_CD', 'Nhàn')], # 7 slots
    '4B': [('AN', 'Tâm'), ('BD_AN', 'Tâm'), ('MT', 'Thy'), ('BD_MT', 'Thy'),
           ('TC', 'Nhàn'), ('TC', 'Nhàn'), ('HDTN_CD', 'Nhàn')], # 7 slots
    '5B': [('AN', 'Tâm'), ('BD_AN', 'Tâm'), ('MT', 'Thy'), ('BD_MT', 'Thy'),
           ('TC', 'Nhàn'), ('TC', 'Nhàn'), ('HDTN_CD', 'Nhàn')], # 7 slots
}

# Verify counts
total_reqs = sum(len(v) for v in reqs.values())
print(f'Total reqs: {total_reqs}, Total free slots: {len(free_slots)}')

teacher_counts = defaultdict(int)
for rlist in reqs.values():
    for sub, t in rlist:
        teacher_counts[t] += 1
print('Target teacher counts in reqs:', dict(teacher_counts))

# Teacher allowed campuses/days:
def is_teacher_allowed(teacher, campus, day, session_id):
    if teacher == 'Tâm':
        if campus == 'diem1':
            return day in (3, 4)
        else:
            return day in (2, 5)
    elif teacher == 'Thy':
        if campus == 'diem1':
            return day in (2, 5, 6)
        else:
            return day in (3, 4)
    elif teacher == 'Nhàn':
        return campus == 'diem2'
    elif teacher == 'Quan':
        return campus == 'diem1'
    elif teacher == 'Phước':
        if campus == 'diem1':
            # Phước at Diem 1 on day 3, 5, 6, and day 2 morning, day 4 morning
            return True # check slotId
        else:
            # Phước only at Diem 2 on T2_C and T4_C
            return session_id in ('T2_C', 'T4_C')
    return True

# Sort slots by slotId so all classes at the same slotId are processed close together
free_slots.sort(key=lambda s: (s['slotId'], s['classId']))

assigned = {}
used_teacher_slot = set()
# Class daily subject tracking: (classId, day, subject)
class_day_subj = set()

def solve(idx):
    if idx == len(free_slots):
        return True
    
    slot = free_slots[idx]
    cid = slot['classId']
    sid = slot['slotId']
    day = slot['day']
    campus = slot['campus']
    sess_id = f"T{day}_{sid.split('_')[1]}"
    
    available_reqs = reqs[cid]
    tried = set()
    
    for i in range(len(available_reqs)):
        sub, teacher = available_reqs[i]
        key = (sub, teacher)
        if key in tried:
            continue
        tried.add(key)
        
        # Check campus / day permission
        if not is_teacher_allowed(teacher, campus, day, sess_id):
            continue
        
        # Check Phước at Diem 1 during T2_C or T4_C
        if teacher == 'Phước' and campus == 'diem1' and sess_id in ('T2_C', 'T4_C'):
            continue
            
        # Check teacher collision at this slot
        t_key = (sid, teacher)
        if t_key in used_teacher_slot:
            continue
            
        # Check max 1 per day for AN, BD_AN, MT, BD_MT
        cds_key = (cid, day, sub)
        if sub in ('AN', 'BD_AN', 'MT', 'BD_MT') and cds_key in class_day_subj:
            continue
            
        # Apply assignment
        assigned[(cid, sid)] = (sub, teacher)
        used_teacher_slot.add(t_key)
        class_day_subj.add(cds_key)
        available_reqs.pop(i)
        
        if solve(idx + 1):
            return True
            
        # Backtrack
        available_reqs.insert(i, (sub, teacher))
        class_day_subj.remove(cds_key)
        used_teacher_slot.remove(t_key)
        del assigned[(cid, sid)]
        
    return False

print('Solving...')
import time
t0 = time.time()
ok = solve(0)
t1 = time.time()
print(f'Solve result: {ok} in {t1 - t0:.3f}s')

if ok:
    full_sched = json.loads(json.dumps(fixed_sched))
    for (cid, sid), (sub, t) in assigned.items():
        full_sched[cid][sid] = {'subjectCode': sub, 'teacherName': t}
    with open('scripts/solved_schedule.json', 'w') as f:
        json.dump(full_sched, f, indent=2)
    print('Saved to scripts/solved_schedule.json!')
