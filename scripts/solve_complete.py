import json
import random
import math
import sys

with open('scripts/free_slots.json') as f:
    free_slots = json.load(f)

with open('scripts/gvcn_slots.json') as f:
    gvcn_slots = json.load(f)

# Build lesson lists for each class
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

# Pre-calculate period sequence per day for consecutive check
day_slots = {}
for s in free_slots:
    key = (s['classId'], s['day'])
    if key not in day_slots:
        day_slots[key] = []
    day_slots[key].append(s['slotId'])

def evaluate(assignment):
    score = 0
    # 1. Teacher collisions per slotId
    slot_teachers = {}
    for (cid, sid), (sub, teacher) in assignment.items():
        if (sid, teacher) not in slot_teachers:
            slot_teachers[(sid, teacher)] = []
        slot_teachers[(sid, teacher)].append(cid)
    
    for (sid, teacher), cids in slot_teachers.items():
        if len(cids) > 1:
            score += 1000 * (len(cids) - 1)
            
    # 2. Campus transit: in each session (day, session), teacher should only be at 1 campus
    session_campuses = {}
    for (cid, sid), (sub, teacher) in assignment.items():
        s = slot_info[(cid, sid)]
        sess_key = (teacher, s['day'], s['session'])
        if sess_key not in session_campuses:
            session_campuses[sess_key] = set()
        session_campuses[sess_key].add(s['campus'])
        
    for sess_key, campuses in session_campuses.items():
        if len(campuses) > 1:
            score += 2000 * (len(campuses) - 1)
            
    # 3. GDTC max 1 per day
    # 4. TA max 1 per day
    class_day_subj = {}
    for (cid, sid), (sub, teacher) in assignment.items():
        s = slot_info[(cid, sid)]
        cd_key = (cid, s['day'], sub)
        class_day_subj[cd_key] = class_day_subj.get(cd_key, 0) + 1
        
    for (cid, day, sub), count in class_day_subj.items():
        if sub == 'GDTC' and count > 1:
            score += 500 * (count - 1)
        if sub == 'TA' and count > 1:
            score += 500 * (count - 1)
            
    return score

# Simulated annealing search
print("Starting Simulated Annealing search...")
for attempt in range(20):
    assignment = {}
    for cid in lessons_by_class:
        shuffled = list(lessons_by_class[cid])
        random.shuffle(shuffled)
        for sid, lesson in zip(slots_by_class[cid], shuffled):
            assignment[(cid, sid)] = lesson
            
    current_score = evaluate(assignment)
    best_score = current_score
    best_assignment = dict(assignment)
    
    T = 100.0
    cooling = 0.9995
    steps = 15000
    
    for step in range(steps):
        if current_score == 0:
            break
            
        cid = random.choice(list(lessons_by_class.keys()))
        s1, s2 = random.sample(slots_by_class[cid], 2)
        if assignment[(cid, s1)] == assignment[(cid, s2)]:
            continue
            
        # Swap
        assignment[(cid, s1)], assignment[(cid, s2)] = assignment[(cid, s2)], assignment[(cid, s1)]
        new_score = evaluate(assignment)
        
        delta = new_score - current_score
        if delta < 0 or random.random() < math.exp(-delta / max(T, 0.01)):
            current_score = new_score
            if current_score < best_score:
                best_score = current_score
                best_assignment = dict(assignment)
                if best_score == 0:
                    break
        else:
            # Revert swap
            assignment[(cid, s1)], assignment[(cid, s2)] = assignment[(cid, s2)], assignment[(cid, s1)]
            
        T *= cooling

    print(f"Attempt {attempt + 1}: best score = {best_score}")
    if best_score == 0:
        print("FOUND PERFECT SOLUTION WITH 0 VIOLATIONS!")
        # Save solution
        full_schedule = dict(gvcn_slots)
        for (cid, sid), (sub, teacher) in best_assignment.items():
            if cid not in full_schedule:
                full_schedule[cid] = {}
            full_schedule[cid][sid] = {
                'subjectCode': sub,
                'teacherName': teacher
            }
            
        with open('scripts/perfect_schedule.json', 'w') as out:
            json.dump(full_schedule, out, indent=2, ensure_ascii=False)
        print("Saved to scripts/perfect_schedule.json")
        sys.exit(0)
