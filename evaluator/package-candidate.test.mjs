import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { packageCandidate } from './package-candidate.mjs';

const scriptPath = fileURLToPath(
  new URL('./package-candidate.mjs', import.meta.url),
);

async function writeFixture(root, relativePath, content) {
  const target = join(root, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content);
}

test('exports only candidate-facing files', async () => {
  const temporaryRoot = await mkdtemp(join(tmpdir(), 'candidate-package-'));
  const source = join(temporaryRoot, 'source');
  const output = join(temporaryRoot, 'output');

  try {
    await writeFixture(source, 'README.md', '# Candidate');
    await writeFixture(source, 'package.json', '{"private":true}');
    await writeFixture(source, 'package-lock.json', '{"lockfileVersion":3}');
    await writeFixture(source, 'tsconfig.base.json', '{}');
    await writeFixture(source, '.gitignore', 'node_modules/');
    await writeFixture(source, 'apps/api/src/server.ts', 'export {};');
    await writeFixture(source, 'evaluator/answer.ts', 'secret');
    await writeFixture(source, 'docs/internal.md', 'internal');
    await writeFixture(source, 'AGENTS.md', 'internal instructions');

    const result = spawnSync(
      process.execPath,
      [scriptPath, '--source', source, '--output', output],
      { encoding: 'utf8' },
    );

    assert.equal(result.status, 0, result.stderr);
    assert.equal(await readFile(join(output, 'README.md'), 'utf8'), '# Candidate');
    assert.equal(
      await readFile(join(output, 'apps/api/src/server.ts'), 'utf8'),
      'export {};',
    );
    await assert.rejects(readFile(join(output, 'evaluator/answer.ts')));
    await assert.rejects(readFile(join(output, 'docs/internal.md')));
    await assert.rejects(readFile(join(output, 'AGENTS.md')));
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});

test('refuses to overwrite candidate source entries', async () => {
  const temporaryRoot = await mkdtemp(join(tmpdir(), 'candidate-package-'));
  const source = join(temporaryRoot, 'source');
  const server = join(source, 'apps/api/src/server.ts');

  try {
    await writeFixture(source, 'apps/api/src/server.ts', 'export {};');

    await assert.rejects(
      packageCandidate(source, join(source, 'apps')),
      /Candidate output cannot overwrite a source entry/,
    );
    assert.equal(await readFile(server, 'utf8'), 'export {};');
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});
