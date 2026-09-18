import sys
sys.path.append('scripts')
from test_raw_table import raw_table, CLASSES, GVCN

# Let's inspect each day one by one:
# Monday (T2), Tuesday (T3), Wednesday (T4), Thursday (T5), Friday (T6)

# We want to build a completely consistent schedule blueprint where:
# - All clear slots from PDF page 1 and page 3 are preserved.
# - Quan teaches EXACTLY 2 periods:
#     5A: T2_C_1 (ĐĐ)
#     5B: T2_C_3 (ĐĐ)
# - No teacher collisions anywhere.
# - Campus adherence: teachers do not travel between Diem 1 and Diem 2 during the same half-day.
# - Every class has 32 slots.

print("Starting solver synthesis...")
