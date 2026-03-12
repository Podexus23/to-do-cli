import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import {
  addTask,
  deleteAllTasks,
  deleteTask,
  getTasksData,
  updateTask,
} from "./task.model.js";
import { parseCommand } from "./helpers/parseCommand.js";
import { isValidStatus, type StatusType } from "./types/interfaces.js";

const rl = createInterface({ input, output });

function parseId(arg: string | undefined): number | null {
  if (arg === undefined || arg === "") return null;
  const id = parseInt(arg.trim(), 10);
  if (isNaN(id) || id.toString() !== arg.trim()) return null;
  return id;
}

const commandsList = {
  exit: () => {
    console.log("bye bye");
    rl.close();
  },
  list: async () => {
    const tasks = await getTasksData();
    const view = tasks?.map(
      (task) => `${task.description} (ID: ${task.id}, status: ${task.status})`,
    );
    view?.forEach((task, i) => {
      console.log(`${i + 1}. ${task}`);
    });
  },
  listByStatus: async (status: StatusType) => {
    const tasks = await getTasksData();
    const filteredView = tasks
      ?.filter((task) => task.status === status)
      .map((task) => `${task.description} (ID: ${task.id})`);
    filteredView?.forEach((task, i) => {
      console.log(`${i + 1}. ${task}`);
    });
  },
  add: async (task: string) => {
    const res = await addTask(task);
    console.log("Task added: " + res.description + " (id: " + res.id + ")");
  },
  delete: async (id: number) => {
    await deleteTask(id);
    console.log(`Task ID:${id} - deleted`);
  },
  update: async (id: number, description: string) => {
    await updateTask(id, { description });
    console.log(`Task ID:${id} - updated`);
  },
  mark: async (id: number, status: StatusType) => {
    await updateTask(id, { status });
    console.log(`Task ID:${id} - status changed`);
  },
  deleteAll: async () => {
    await deleteAllTasks();
    console.log("All tasks are deleted");
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
      {
        const status = args[0];
        if (status && isValidStatus(status))
          await commandsList.listByStatus(status);
        else await commandsList.list();
      }
      break;

    case "add":
      if (args[0]) await commandsList.add(args[0]);
      else console.error("You need to describe task");
      break;

    case "delete": {
      const id = parseId(args[0]);
      if (id === null) {
        console.error("You need to add ID to delete");
        return true;
      }
      await commandsList.delete(id);
      break;
    }
    case "update": {
      const id = parseId(args[0]);
      if (id === null || !args[1]) {
        console.error("You need to add ID and description to update task");
        return true;
      }
      await commandsList.update(id, args[1]);
      break;
    }
    case "mark-done": {
      const idDone = parseId(args[0]);
      if (idDone === null) {
        console.error("You need to add ID");
        return true;
      }
      await commandsList.mark(idDone, "done");
      break;
    }
    case "mark-todo": {
      const idTodo = parseId(args[0]);
      if (idTodo === null) {
        console.error("You need to add ID");
        return true;
      }
      await commandsList.mark(idTodo, "todo");
      break;
    }
    case "mark-in-progress": {
      const idProgress = parseId(args[0]);
      if (idProgress === null) {
        console.error("You need to add ID");
        return true;
      }
      await commandsList.mark(idProgress, "in-progress");
      break;
    }
    case "delete-all": {
      await commandsList.deleteAll();
      break;
    }

    default:
      console.log("Unknown command");
  }
  return true;
}
