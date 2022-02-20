'use strict';

const core = require('@actions/core');
const artifact = require('@actions/artifact').create();
const parser = require('action-input-parser');
const command = require('../../lib/command');

async function loadImage(fileName) {
  return command.exec(
    'docker',
    'load',
    '-i', fileName,
  );
}

async function tagImage(imageName, tag) {
  return command.exec(
    'docker',
    'tag',
    imageName,
    tag,
  );
}

async function pushImage(tag) {
  return command.exec(
    'docker',
    'push',
    tag,
  );
}

async function main() {
  try {
    const imageName = parser.getInput('name');
    const imagePath = imageName + '.tgz';
    const tags = parser.getInput('tags', { type: 'array' });

    await artifact.downloadArtifact(imageName);
    await loadImage(imagePath);

    for (const tag of tags) {
      await tagImage(imageName, tag);
      await pushImage(tag);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();