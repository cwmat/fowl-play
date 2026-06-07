#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_VOICE_ID = "rHWSYoq8UlV0YIBKMryp";
const DEFAULT_MODEL_ID = "eleven_multilingual_v2";
const DEFAULT_OUTPUT_FORMAT = "mp3_44100_128";
const QUESTION_PATH = "public/questions.json";
const READER_DIR = "public/reader";
const MANIFEST_PATH = "public/reader/manifest.json";

const INTRO_STARTERS = [
  "Alright, on to the next one.",
  "Okay flock, here comes the next question.",
  "Ready or not, next question.",
  "Let's keep flying. Next question.",
];

const REVEAL_STARTERS = [
  "And the correct answer is",
  "Phew, that was a tough one, but here's the right answer.",
  "Let's see how you did. The answer is",
  "Here comes the reveal. The correct answer is",
];

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

async function main() {
  const options = parseArgs(process.argv.slice(2));
  await loadLocalEnv();

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = options.voiceId ?? process.env.ELEVENLABS_VOICE_ID ?? DEFAULT_VOICE_ID;
  const modelId = options.modelId ?? process.env.ELEVENLABS_MODEL_ID ?? DEFAULT_MODEL_ID;
  const outputFormat =
    options.outputFormat ?? process.env.ELEVENLABS_OUTPUT_FORMAT ?? DEFAULT_OUTPUT_FORMAT;

  if (!options.dryRun && !apiKey) {
    throw new Error("Missing ELEVENLABS_API_KEY. Add it to your shell or .env.local before running.");
  }

  const questions = JSON.parse(await readProjectFile(QUESTION_PATH));
  const selectedQuestions = selectQuestions(questions, options);
  const phases = options.phase === "all" ? ["intro", "reveal"] : [options.phase];

  await mkdir(projectPath(READER_DIR), { recursive: true });

  const manifest = await readManifest();
  manifest.voiceId = voiceId;
  manifest.modelId = modelId;
  manifest.outputFormat = outputFormat;
  manifest.generatedAt = new Date().toISOString();
  manifest.clips ??= {};
  manifest.scripts ??= {};

  for (const question of selectedQuestions) {
    for (const phase of phases) {
      const script = buildReaderScript(question, phase, options.seed);
      const outputFile = `${question.id}-${phase}.mp3`;
      const publicPath = `/reader/${outputFile}`;
      const outputPath = projectPath(READER_DIR, outputFile);

      if (options.dryRun) {
        console.log(`[dry-run] ${question.id} ${phase}: ${script}`);
        continue;
      }

      if (existsSync(outputPath) && !options.force) {
        setManifestEntry(manifest, question.id, phase, publicPath, script);
        console.log(`[skip] ${publicPath} exists. Use --force to regenerate.`);
        continue;
      }

      const audio = await generateSpeech({
        apiKey,
        modelId,
        outputFormat,
        script,
        seed: options.seed,
        voiceId,
      });

      await writeFile(outputPath, audio);
      setManifestEntry(manifest, question.id, phase, publicPath, script);
      console.log(`[write] ${publicPath}`);
    }
  }

  if (!options.dryRun) {
    await writeFile(projectPath(MANIFEST_PATH), `${JSON.stringify(manifest, null, 2)}\n`);
    console.log(`[write] ${MANIFEST_PATH}`);
  }
}

function parseArgs(args) {
  const options = {
    dryRun: false,
    force: false,
    ids: null,
    indexes: null,
    phase: "all",
    seed: "fowl-play-reader-v1",
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];

    if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--force") {
      options.force = true;
    } else if (arg === "--ids") {
      options.ids = parseCsv(next);
      index += 1;
    } else if (arg === "--indexes") {
      options.indexes = parseIndexList(next);
      index += 1;
    } else if (arg === "--phase") {
      options.phase = parsePhase(next);
      index += 1;
    } else if (arg === "--seed") {
      options.seed = next;
      index += 1;
    } else if (arg === "--voice-id") {
      options.voiceId = next;
      index += 1;
    } else if (arg === "--model-id") {
      options.modelId = next;
      index += 1;
    } else if (arg === "--output-format") {
      options.outputFormat = next;
      index += 1;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return options;
}

async function loadLocalEnv() {
  for (const fileName of [".env.local", ".env"]) {
    const envPath = projectPath(fileName);

    if (!existsSync(envPath)) {
      continue;
    }

    const contents = await readFile(envPath, "utf8");

    for (const line of contents.split(/\r?\n/)) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const separatorIndex = trimmed.indexOf("=");

      if (separatorIndex === -1) {
        continue;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = unquoteEnvValue(trimmed.slice(separatorIndex + 1).trim());

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}

function unquoteEnvValue(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function parseCsv(value) {
  if (!value) {
    throw new Error("Expected a comma-separated value.");
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseIndexList(value) {
  return parseCsv(value).flatMap((item) => {
    if (item.includes("-")) {
      const [start, end] = item.split("-").map((part) => Number(part));

      if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start) {
        throw new Error(`Invalid index range: ${item}`);
      }

      return Array.from({ length: end - start + 1 }, (_, offset) => start + offset);
    }

    const numeric = Number(item);

    if (!Number.isInteger(numeric) || numeric < 1) {
      throw new Error(`Invalid question index: ${item}`);
    }

    return [numeric];
  });
}

function parsePhase(value) {
  if (value === "intro" || value === "reveal" || value === "all") {
    return value;
  }

  throw new Error("--phase must be intro, reveal, or all.");
}

function selectQuestions(questions, options) {
  let selected = questions;

  if (options.ids) {
    const idSet = new Set(options.ids);
    selected = selected.filter((question) => idSet.has(question.id));
  }

  if (options.indexes) {
    const indexSet = new Set(options.indexes);
    selected = selected.filter((_, index) => indexSet.has(index + 1));
  }

  if (selected.length === 0) {
    throw new Error("No questions matched the requested filter.");
  }

  return selected;
}

function setManifestEntry(manifest, questionId, phase, publicPath, script) {
  manifest.clips[questionId] ??= {};
  manifest.scripts[questionId] ??= {};
  manifest.clips[questionId][phase] = publicPath;
  manifest.scripts[questionId][phase] = script;
}

function buildReaderScript(question, phase, seed) {
  if (phase === "intro") {
    const starter = pickVariant(INTRO_STARTERS, `${seed}:${question.id}:intro`);
    return `${starter} ${question.prompt}`;
  }

  const starter = pickVariant(REVEAL_STARTERS, `${seed}:${question.id}:reveal`);
  const answerLetter = String.fromCharCode(65 + question.answer_index);
  const answer = question.choices[question.answer_index];
  return `${starter} ${answerLetter}... ${answer}. ${question.fun_fact}`;
}

function pickVariant(variants, key) {
  return variants[stableHash(key) % variants.length];
}

function stableHash(value) {
  let hash = 0;

  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  return hash;
}

async function generateSpeech({ apiKey, modelId, outputFormat, script, seed, voiceId }) {
  const url = new URL(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`);
  url.searchParams.set("output_format", outputFormat);

  const response = await fetch(url, {
    body: JSON.stringify({
      model_id: modelId,
      seed: stableHash(seed),
      text: script,
      voice_settings: {
        similarity_boost: 0.75,
        stability: 0.45,
        style: 0.2,
        use_speaker_boost: true,
      },
    }),
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": apiKey,
    },
    method: "POST",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`ElevenLabs request failed ${response.status}: ${body}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function readManifest() {
  const manifestPath = projectPath(MANIFEST_PATH);

  if (!existsSync(manifestPath)) {
    return {};
  }

  return JSON.parse(await readFile(manifestPath, "utf8"));
}

async function readProjectFile(...segments) {
  return readFile(projectPath(...segments), "utf8");
}

function projectPath(...segments) {
  return path.join(projectRoot, ...segments);
}

function printHelp() {
  console.log(`
Generate host-only question reader audio with ElevenLabs.

Usage:
  npm run audio:reader -- [options]

Options:
  --phase intro|reveal|all       Which clip type to generate. Default: all
  --indexes 1,2,14-17            1-based question indexes from public/questions.json
  --ids q014,q017                Specific question ids
  --force                        Regenerate files that already exist
  --dry-run                      Print scripts and update no audio files
  --seed value                   Stable phrase variant seed
  --voice-id value               Override voice id. Default: ${DEFAULT_VOICE_ID}
  --model-id value               Override model id. Default: ${DEFAULT_MODEL_ID}
  --output-format value          Override output format. Default: ${DEFAULT_OUTPUT_FORMAT}

Env:
  ELEVENLABS_API_KEY             Required unless --dry-run
  ELEVENLABS_VOICE_ID            Optional, defaults to the project voice
  ELEVENLABS_MODEL_ID            Optional
  ELEVENLABS_OUTPUT_FORMAT       Optional
`);
}
