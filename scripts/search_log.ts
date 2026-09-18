import * as fs from 'fs';
import * as readline from 'readline';

async function searchTranscript() {
  const filePath = '/.aistudio/artifacts/brain/7d36c019-6a33-45f3-8cc4-cca87cb76e2e/.system_generated/logs/transcript.jsonl';
  if (!fs.existsSync(filePath)) {
    console.log('Transcript file not found');
    return;
  }
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let lineNum = 0;
  for await (const line of rl) {
    lineNum++;
    if (line.includes('1A') && line.includes('SHDC') || line.includes('classes_diem1') || line.includes('def build_and_solve_schedule')) {
      console.log(`Match at line ${lineNum}: ${line.slice(0, 300)}...`);
    }
  }
}

searchTranscript();
