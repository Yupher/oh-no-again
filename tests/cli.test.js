import { describe, it, expect } from 'vitest';
import { execa } from 'execa';
import path from 'path';
import fs from 'fs';

describe('CLI — oha', () => {
  const binPath = path.resolve('./bin/oha');
  const inputPath = path.resolve('./tests/mock-users.json');

  it('should batch fetch users successfully', async () => {
    // Make sure mock file exists
    const input = [{ id: 1 }, { id: 2 }, { id: 3 }];
    fs.writeFileSync(inputPath, JSON.stringify(input, null, 2));

    const { stdout } = await execa('node', [
      binPath,
      '--input',
      inputPath,
      '--url',
      'https://jsonplaceholder.typicode.com/users/{{id}}',
    ]);

    const parsed = JSON.parse(stdout);
    expect(parsed).toBeDefined();
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBeGreaterThan(0);
    expect(parsed[0]).toHaveProperty('success');
  });
});
