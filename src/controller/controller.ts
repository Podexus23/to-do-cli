import { parseCommand } from '../helpers/parseCommand.js';
import { isValidStatus } from '../types/interfaces.js';
import { parseId } from '../helpers/parseId.js';
import { commandsList } from './commandList.js';

const MAX_DESC_LENGTH = 1000;

export async function applicationController(answer: string) {
  const [command, ...args] = parseCommand(answer);

  switch (command) {
    case 'exit':
      commandsList.exit();
      return false;

    case 'list':
      {
        const status = args[0];
        if (status && isValidStatus(status)) await commandsList.listByStatus(status);
        else await commandsList.list();
      }
      break;

    case 'add':
      if (!args[0]) {
        console.error('You need to describe task');
      } else if (args[0].length > MAX_DESC_LENGTH) {
        console.error(`Description is too long (max ${MAX_DESC_LENGTH} characters)`);
      } else {
        await commandsList.add(args[0]);
      }
      break;

    case 'delete': {
      const id = parseId(args[0]);
      if (id === null) {
        console.error('You need to add ID to delete');
        return true;
      }
      await commandsList.delete(id);
      break;
    }
    case 'update': {
      const id = parseId(args[0]);
      const newDesc = args[1];
      if (id === null || !newDesc) {
        console.error('You need to add ID and description to update task');
        return true;
      }
      if (newDesc.length > MAX_DESC_LENGTH) {
        console.error(`Description is too long (max ${MAX_DESC_LENGTH} characters)`);
        return true;
      }
      await commandsList.update(id, newDesc);
      break;
    }
    case 'mark-done': {
      const idDone = parseId(args[0]);
      if (idDone === null) {
        console.error('You need to add ID');
        return true;
      }
      await commandsList.mark(idDone, 'done');
      break;
    }
    case 'mark-todo': {
      const idTodo = parseId(args[0]);
      if (idTodo === null) {
        console.error('You need to add ID');
        return true;
      }
      await commandsList.mark(idTodo, 'todo');
      break;
    }
    case 'mark-in-progress': {
      const idProgress = parseId(args[0]);
      if (idProgress === null) {
        console.error('You need to add ID');
        return true;
      }
      await commandsList.mark(idProgress, 'in-progress');
      break;
    }
    case 'delete-all': {
      await commandsList.deleteAll();
      break;
    }
    case 'help': {
      commandsList.help();
      break;
    }

    default:
      console.log('Unknown command');
  }
  return true;
}
