//add/ update/ delete / list {type} / mark-type

/*
 1. add task +
 1.1 show all tasks +
 2. remove task
 3. remove all

*/

import { applicationController } from "./controller.js";
import { checkTasksFile, getTasksData } from "./task.model.js";

async function main() {
  let isRunning = true;

  await checkTasksFile();
  await getTasksData();

  while (isRunning) {
    if ((await applicationController()) === false) isRunning = false;
  }
}

await main();
