//add/ update/ delete / list {type} / mark-type

/*
 - add mark task with commands(mark-in-progress, mark-done)
 - add list by status(done, todo, in-progress)

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
