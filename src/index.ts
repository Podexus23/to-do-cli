//add/ update/ delete / list {type} / mark-type

import fs from "node:fs/promises";
import nodeOs from "node:os";
import path from "node:path";
import { isTasks, type Task } from "./types/interfaces.js";
import { describe } from "node:test";

// 1.work with json
// check db folder, if there is no one create with tasks.json

const TASKS_PATH = path.resolve(nodeOs.homedir(), "tasks-app", "data.json");
let tasksData: Task[] = [];

async function checkTasksFile() {
  try {
    await fs.access(TASKS_PATH);
    console.log("Data file exists");
  } catch (error) {
    console.log("Data file is not found");
    console.log("Creating file...");
    const dbDir = path.dirname(TASKS_PATH);
    await fs.mkdir(dbDir, { recursive: true });
    await fs.writeFile(TASKS_PATH, JSON.stringify(tasksData));
  }
}

async function getTasksData() {
  try {
    const jsonData = await fs.readFile(TASKS_PATH, { encoding: "utf-8" });
    const parsedJson = JSON.parse(jsonData);
    tasksData = isTasks(parsedJson) ? parsedJson : tasksData;
    console.log(tasksData);
    console.log("Tasks added to the list");
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
    else throw new Error("Unknown app error");
  }
}

function addTask(data: string) {
  const id = (tasksData.at(-1)?.id ?? 0) + 1;
  const task: Task = {
    id,
    description: data,
    status: "todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasksData.push(task);
  fs.writeFile(TASKS_PATH, JSON.stringify(tasksData));
}

async function main() {
  await checkTasksFile();
  await getTasksData();
  await addTask("first task");
}

main();
