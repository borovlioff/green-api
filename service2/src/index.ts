import { ActionHandler, getRabbitMQService } from './RabbitmqService';
import { TaskService } from './TaskService';

const taskService = new TaskService();


const handleAction: ActionHandler = async (action, payload) => {
  if (action === 'getTasks') {
    return taskService.getTasks(payload);
  } else if (action === 'getTaskById') {
    return taskService.getTaskById(payload);
  } else if (action === 'createTask') {
    return taskService.createTask(payload);
  } else if (action === 'updateTask') {
    return taskService.updateTask(payload);
  } else if (action === 'deleteTask') {
    return taskService.deleteTask(payload);
  } else {
    throw new Error('Unknown action.');
  }
};



async function start() {
   await getRabbitMQService(handleAction);
}

start()