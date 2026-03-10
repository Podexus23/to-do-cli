import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { addTask, deleteTask, getTasksData, updateTask } from "./task.model.js";
import { parseCommand } from "./helpers/parseCommand.js";

const rl = createInterface({ input, output });
const commandsList = {
  exit: () => {
    console.log("bye bye");
    rl.close();
  },
  list: async () => {
    const tasks = await getTasksData();
    const view = tasks?.map((task) => `${task.description} (ID: ${task.id})`);
    view?.forEach((task, i) => {
      console.log(`${i + 1}. ${task}`);
    });
  },
  add: async (task: string) => {
    const res = await addTask(task);
    console.log("Task added: " + res.description + "(id: " + res.id + ")");
  },
  delete: async (id: number) => {
    await deleteTask(id);
    console.log(`Task ID:${id} - deleted`);
  },
  update: async (id: number, description: string) => {
    await updateTask(id, description);
    console.log(`Task ID:${id} - updated`);
  },
};

export async function applicationController() {
  const answer = await rl.question("> ");
  const [command, ...args] = parseCommand(answer);

  switch (command) {
    case "exit":
      commandsList.exit();
      return false;

    case "list":
      await commandsList.list();
      break;

    case "add":
      if (args[0]) await commandsList.add(args[0]);
      else console.error("you need to describe task");
      break;

    case "delete": {
      if (!args[0]) {
        console.error("You need to add ID to delete");
        return true;
      }

      const id = parseInt(args[0], 10);
      if (isNaN(id) || id.toString() !== args[0].trim()) {
        console.log("Error: ID is must be a number");
        return;
      }

      await commandsList.delete(id);
      break;
    }

    case "update": {
      if (!args[0] || !args[1]) {
        console.error("You need to add ID and description to update task");
        return true;
      }

      const id = parseInt(args[0], 10);
      if (isNaN(id) || id.toString() !== args[0].trim()) {
        console.log("Error: ID is must be a number");
        return;
      }

      await commandsList.update(id, args[1]);
      break;
    }

    default:
      console.log("Unknown command");
  }
  return true;
}
