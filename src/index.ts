#!/usr/bin/env node

import { applicationController } from './controller.js';
import { checkTasksFile, getTasksData } from './task.model.js';

async function main() {
  let isRunning = true;

  try {
    await checkTasksFile();
    await getTasksData();

    while (isRunning) {
      if ((await applicationController()) === false) isRunning = false;
    }
  } catch (error) {
    if (error instanceof Error) console.error(`Error: ${error.message}`);
    else console.error('Unknown error');
  }
}

await main();
