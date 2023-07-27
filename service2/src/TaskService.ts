
import { v4 as uuidv4 } from 'uuid';
import { GetTasksPayload, GetTaskByIdPayload, CreateTaskPayload, UpdateTaskPayload, DeleteTaskPayload , Task, TaskId} from 'task'; 


export class TaskService {
  private tasks: Record<TaskId, Task> = {};

  constructor(){
    this.tasks[1]= {
      id:"1",
      title:"Test1Title",
      description:"Test1Desc"
    }
  }

  async getTasks(payload: GetTasksPayload) {
    const { limit } = payload;
    return Object.values(this.tasks).slice(0, limit);
  }

  async getTaskById(payload: GetTaskByIdPayload) {
    const { id } = payload;
    const task = this.tasks[id];
    if (task) {
      return task;
    } else {
      throw new Error('Task not found.');
    }
  }

  async createTask(payload: CreateTaskPayload) {
    let { title, description } = payload;
    const id = uuidv4();
    if (!description) {
      description = '';
    }
    const newTask: Task = { id,title, description };
    this.tasks[id] = newTask;
    return newTask;
  }

  async updateTask(payload: UpdateTaskPayload) {
    const { id, ...updateTask } = payload;
    if (this.tasks[id]) {
      this.tasks[id] = { ...this.tasks[id], ...updateTask };
      return this.tasks[id];
    } else {
      throw new Error('Task not found.');
    }
  }

  async deleteTask(payload: DeleteTaskPayload) {
    const { id } = payload;
    if (this.tasks[id]) {
      delete this.tasks[id];
      return { message: 'Task deleted successfully.' };
    } else {
      throw new Error('Task not found.');
    }
  }
}
