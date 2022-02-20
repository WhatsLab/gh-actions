'use strict';

const core = require('@actions/core');
const artifact = require('@actions/artifact').create();
const parser = require('action-input-parser');
const command = require('../../lib/command');

async function buildImage(dockerfile, context, tags, buildArgs) {
  return command.exec(
    'docker',
    'build',
    ...command.args.map(tags, tag => ['-t ', tag]),
    ...command.args.map(buildArgs, arg => ['--build-arg ', arg]),
    '-f', dockerfile,
    context,
  );
}

async function exportImage(imageName, fileName) {
  return command.exec(
    'docker',
    'save',
    imageName,
    '-o', fileName,
  );
}

async function main() {
  try {
    const context = parser.getInput('context');
    const dockerfile = parser.getInput('dockerfile');
    const imageName = parser.getInput('name');
    const buildArgs = parser.getInput('build-args', { type: 'array' });
    const imagePath = imageName + '.tgz';

    await buildImage(dockerfile, context, [imageName], buildArgs);
    await exportImage(imageName, imagePath);
    await artifact.uploadArtifact(imageName, [imagePath], '.');
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();