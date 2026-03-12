#!/usr/bin/env node

import { applicationController } from './controller.js';
import { checkTasksFile, getTasksData } from './task.model.js';

async function main() {
  let isRunning = true;

  await checkTasksFile();
  await getTasksData();

  while (isRunning) {
    if ((await applicationController()) === false) isRunning = false;
  }
}

await main();
