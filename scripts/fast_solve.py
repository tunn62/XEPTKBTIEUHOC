import json
import random
import math
import sys
import time

with open('scripts/free_slots.json') as f:
    free_slots = json.load(f)

with open('scripts/gvcn_slots.json') as f:
    gvcn_slots = json.load(f)

# Teachers and their targets:
# Thịnh: 20 GDTC (2 in each of 10 classes)
# Nương: 20 TA (4 in 3A, 4 in 4A, 3 in 5A, 3 in 3B, 3 in 4B, 3 in 5B)
# Phương: 10 TH (1 in each class, ONLY TH!)
# Tâm: 20 (10 AN + 10 BD_AN, 1 AN and 1 BD_AN in each class)
# Thy: 22 (10 MT + 10 BD_MT + 2 HDTN_CD, 1 MT and 1 BD_MT in each class)
# Phước: 19 (TNXH / TC / HDTN)
# Nhàn: 16 (TC / HDTN)
# Quan: 6 (TC / HDTN)

lessons_by_class = {
    '1A': [
        ('GDTC', 'Thịnh'), ('GDTC', 'Thịnh'),
        ('TH', 'Phương'),
        ('AN', 'Tâm'), ('BD_AN', 'Tâm'),
        ('MT', 'Thy'), ('BD_MT', 'Thy'),
        ('HDTN_CD', 'Quan'),
        ('TC', 'Phước'), ('TC', 'Phước'), ('TC', 'Phước'), ('TC', 'Phước'), ('TC', 'Quan')
    ],
    '2A': [
        ('GDTC', 'Thịnh'), ('GDTC', 'Thịnh'),
        ('TH', 'Phương'),
        ('AN', 'Tâm'), ('BD_AN', 'Tâm'),
        ('MT', 'Thy'), ('BD_MT', 'Thy'),
        ('HDTN_CD', 'Quan'),
        ('TC', 'Phước'), ('TC', 'Phước'), ('TC', 'Phước'), ('TC', 'Phước'), ('TC', 'Phước'),
        ('TC', 'Quan'), ('TC', 'Quan')
    ],
    '3A': [
        ('GDTC', 'Thịnh'), ('GDTC', 'Thịnh'),
        ('TA', 'Nương'), ('TA', 'Nương'), ('TA', 'Nương'), ('TA', 'Nương'),
        ('TH', 'Phương'),
        ('AN', 'Tâm'), ('BD_AN', 'Tâm'),
        ('MT', 'Thy'), ('BD_MT', 'Thy'),
        ('HDTN_CD', 'Thy'),
        ('TC', 'Phước')
    ],
    '4A': [
        ('GDTC', 'Thịnh'), ('GDTC', 'Thịnh'),
        ('TA', 'Nương'), ('TA', 'Nương'), ('TA', 'Nương'), ('TA', 'Nương'),
        ('TH', 'Phương'),
        ('AN', 'Tâm'), ('BD_AN', 'Tâm'),
        ('MT', 'Thy'), ('BD_MT', 'Thy'),
        ('HDTN_CD', 'Phước'),
        ('TC', 'Phước')
    ],
    '5A': [
        ('GDTC', 'Thịnh'), ('GDTC', 'Thịnh'),
        ('TA', 'Nương'), ('TA', 'Nương'), ('TA', 'Nương'),
        ('TH', 'Phương'),
        ('AN', 'Tâm'), ('BD_AN', 'Tâm'),
        ('MT', 'Thy'), ('BD_MT', 'Thy'),
        ('HDTN_CD', 'Thy'),
        ('TC', 'Phước'), ('TC', 'Phước')
    ],
    '1B': [
        ('GDTC', 'Thịnh'), ('GDTC', 'Thịnh'),
        ('TH', 'Phương'),
        ('AN', 'Tâm'), ('BD_AN', 'Tâm'),
        ('MT', 'Thy'), ('BD_MT', 'Thy'),
        ('HDTN_CD', 'Nhàn'),
        ('TC', 'Phước'), ('TC', 'Phước'),
        ('TC', 'Nhàn'), ('TC', 'Nhàn'), ('TC', 'Nhàn'), ('TC', 'Nhàn')
    ],
    '2B': [
        ('GDTC', 'Thịnh'), ('GDTC', 'Thịnh'),
        ('TH', 'Phương'),
        ('AN', 'Tâm'), ('BD_AN', 'Tâm'),
        ('MT', 'Thy'), ('BD_MT', 'Thy'),
        ('HDTN_CD', 'Nhàn'),
        ('TC', 'Phước'), ('TC', 'Phước'),
        ('TC', 'Nhàn'), ('TC', 'Nhàn'), ('TC', 'Nhàn')
    ],
    '3B': [
        ('GDTC', 'Thịnh'), ('GDTC', 'Thịnh'),
        ('TA', 'Nương'), ('TA', 'Nương'), ('TA', 'Nương'),
        ('TH', 'Phương'),
        ('AN', 'Tâm'), ('BD_AN', 'Tâm'),
        ('MT', 'Thy'), ('BD_MT', 'Thy'),
        ('HDTN_CD', 'Nhàn'),
        ('TC', 'Phước'),
        ('TC', 'Nhàn')
    ],
    '4B': [
        ('GDTC', 'Thịnh'), ('GDTC', 'Thịnh'),
        ('TA', 'Nương'), ('TA', 'Nương'), ('TA', 'Nương'),
        ('TH', 'Phương'),
        ('AN', 'Tâm'), ('BD_AN', 'Tâm'),
        ('MT', 'Thy'), ('BD_MT', 'Thy'),
        ('HDTN_CD', 'Nhàn'),
        ('TC', 'Nhàn'), ('TC', 'Nhàn')
    ],
    '5B': [
        ('GDTC', 'Thịnh'), ('GDTC', 'Thịnh'),
        ('TA', 'Nương'), ('TA', 'Nương'), ('TA', 'Nương'),
        ('TH', 'Phương'),
        ('AN', 'Tâm'), ('BD_AN', 'Tâm'),
        ('MT', 'Thy'), ('BD_MT', 'Thy'),
        ('HDTN_CD', 'Nhàn'),
        ('TC', 'Nhàn'), ('TC', 'Nhàn')
    ]
}

# Group free slots by class
slots_by_class = {c: [] for c in lessons_by_class}
slot_info = {}
for s in free_slots:
    slots_by_class[s['classId']].append(s['slotId'])
    slot_info[(s['classId'], s['slotId'])] = s

# We want fixed sessions per specialist to prevent ANY campus transit:
# In Campus 1 (diem1):
# Thịnh: Mornings
# Nương: Mornings
# Phương: Afternoons (T2_C, T4_C, T5_C)
# Tâm: T3 full day, T4 afternoon
# Thy: T5 afternoon, T6 morning, T2 afternoon
# In Campus 2 (diem2):
# Thịnh: Afternoons
# Nương: Afternoons
# Phương: Mornings (T3_S, T5_S, T4_S)
# Tâm: T2 afternoon, T5 full day
# Thy: T2 morning, T3 afternoon, T4 morning

# Hard constraints to evaluate:
def evaluate_full(assignment):
    score = 0
    # 1. Collisions: (sid, teacher)
    st = {}
    for (cid, sid), (sub, teacher) in assignment.items():
        st[(sid, teacher)] = st.get((sid, teacher), 0) + 1
    for count in st.values():
        if count > 1:
            score += 1000 * (count - 1)
            
    # 2. Campus transit in each session
    tc_sess = {}
    for (cid, sid), (sub, teacher) in assignment.items():
        s = slot_info[(cid, sid)]
        k = (teacher, s['day'], s['session'])
        if k not in tc_sess:
            tc_sess[k] = set()
        tc_sess[k].add(s['campus'])
    for campuses in tc_sess.values():
        if len(campuses) > 1:
            score += 2000 * (len(campuses) - 1)
            
    # 3. GDTC max 1/day
    # 4. TA max 1/day
    cds = {}
    for (cid, sid), (sub, teacher) in assignment.items():
        s = slot_info[(cid, sid)]
        k = (cid, s['day'], sub)
        cds[k] = cds.get(k, 0) + 1
    for (cid, day, sub), count in cds.items():
        if sub in ('GDTC', 'TA') and count > 1:
            score += 500 * (count - 1)
            
    return score

print("Starting fast randomized restarts with local hill climbing...", flush=True)

start_time = time.time()
best_overall_score = 999999
best_overall_assignment = None

for restart in range(100):
    assignment = {}
    for cid in lessons_by_class:
        shuffled = list(lessons_by_class[cid])
        random.shuffle(shuffled)
        for sid, lesson in zip(slots_by_class[cid], shuffled):
            assignment[(cid, sid)] = lesson
            
    score = evaluate_full(assignment)
    
    # Fast hill climbing / simulated annealing
    T = 50.0
    for step in range(8000):
        if score == 0:
            break
            
        cid = random.choice(list(lessons_by_class.keys()))
        s1, s2 = random.sample(slots_by_class[cid], 2)
        if assignment[(cid, s1)] == assignment[(cid, s2)]:
            continue
            
        # Try swap
        assignment[(cid, s1)], assignment[(cid, s2)] = assignment[(cid, s2)], assignment[(cid, s1)]
        new_score = evaluate_full(assignment)
        
        delta = new_score - score
        if delta <= 0:
            score = new_score
        elif random.random() < math.exp(-delta / max(T, 0.05)):
            score = new_score
        else:
            assignment[(cid, s1)], assignment[(cid, s2)] = assignment[(cid, s2)], assignment[(cid, s1)]
            
        T *= 0.9995

    if score < best_overall_score:
        best_overall_score = score
        best_overall_assignment = dict(assignment)
        print(f"Restart {restart}: new best score = {score} (elapsed {time.time() - start_time:.1f}s)", flush=True)

    if best_overall_score == 0:
        print(f"SUCCESS in restart {restart}! Found solution with 0 violations!", flush=True)
        break

if best_overall_score == 0:
    full_schedule = dict(gvcn_slots)
    for (cid, sid), (sub, teacher) in best_overall_assignment.items():
        if cid not in full_schedule:
            full_schedule[cid] = {}
        full_schedule[cid][sid] = {
            'subjectCode': sub,
            'teacherName': teacher
        }
        
    with open('scripts/perfect_schedule.json', 'w') as out:
        json.dump(full_schedule, out, indent=2, ensure_ascii=False)
    print("Saved perfect schedule to scripts/perfect_schedule.json", flush=True)
else:
    print(f"Best score achieved: {best_overall_score}", flush=True)
