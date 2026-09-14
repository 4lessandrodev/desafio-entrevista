import { cp, mkdir, rm } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const candidateEntries = [
  '.gitignore',
  'README.md',
  'package.json',
  'package-lock.json',
  'tsconfig.base.json',
  'apps',
];

function readOption(name, fallback) {
  const index = process.argv.indexOf(name);

  if (index === -1) {
    return fallback;
  }

  const value = process.argv[index + 1];

  if (!value || value.startsWith('--')) {
    throw new Error(`Missing value for ${name}`);
  }

  return value;
}

export async function packageCandidate(sourceDirectory, outputDirectory) {
  const source = resolve(sourceDirectory);
  const output = resolve(outputDirectory);

  const overwritesSource =
    source === output ||
    source.startsWith(`${output}${sep}`) ||
    candidateEntries.some((entry) => {
      const sourceEntry = resolve(source, entry);
      return output === sourceEntry || output.startsWith(`${sourceEntry}${sep}`);
    });

  if (overwritesSource) {
    throw new Error('Candidate output cannot overwrite a source entry');
  }

  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });

  for (const entry of candidateEntries) {
    await cp(resolve(source, entry), resolve(output, entry), {
      recursive: true,
    });
  }
}

const isDirectExecution =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isDirectExecution) {
  const source = resolve(readOption('--source', process.cwd()));
  const output = resolve(
    readOption('--output', resolve(source, 'dist/candidate')),
  );

  await packageCandidate(source, output);
  console.log(`Candidate package created at ${output}`);
}
