
import express from 'express';
import { CreateTaskPayload, DeleteTaskPayload, GetTaskByIdPayload, GetTasksPayload, UpdateTaskPayload } from 'task';
import {  getRabbitMQSerivce } from './RabbitmqService';

const router = express.Router();



router.get('/tasks', async (req, res) => {
  try {
    const rabbitMQService = await getRabbitMQSerivce();
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const requestId = req.headers['request_id'] as string;
    const payload: GetTasksPayload = { limit };
    
    const result = await rabbitMQService.sendAndReceive('getTasks', payload, requestId);
    if (result) {
      res.json(result);
    } else {
      res.status(500).json({ error: 'No response received from Microservice M2.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
});


router.get('/tasks/:id', async (req, res) => {
  try {
    const rabbitMQService = await getRabbitMQSerivce();
    const taskIdParam = req.params.id;
    const payload: GetTaskByIdPayload = { id: taskIdParam }
    const requestId = req.headers['request_id'] as string;
    const result = await rabbitMQService.sendAndReceive('getTaskById', payload, requestId);

    if (result) {
      res.json(result);
    } else {
      res.status(500).json({ error: 'No response received from Microservice M2.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
});


router.post('/tasks', async (req, res) => {
  try {
    const taskData = req.body;
    const requestId = req.headers['request_id'] as string;
    if (!taskData.title) { res.status(400).json({ error: "Bad request" }) }
    const rabbitMQService = await getRabbitMQSerivce();
    const payload: CreateTaskPayload = { title: taskData.title, description: taskData.description };
    
    const result = await rabbitMQService.sendAndReceive('createTask', payload, requestId);

    if (result) {
      res.status(201).json({ message: 'Task created successfully.', task: result });
    } else {
      res.status(500).json({ error: 'No response received from Microservice M2.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
});


router.put('/tasks/:id', async (req, res) => {
  try {
    const taskIdParam = req.params.id;
    const updatedTaskData = req.body;
    const requestId = req.headers['request_id'] as string;
    const payload: UpdateTaskPayload = { id: taskIdParam };
    updatedTaskData.title !== "" ? payload.title = updatedTaskData.title : null;
    updatedTaskData.description !== "" ? payload.description = updatedTaskData.description : null;
    
    const rabbitMQService = await getRabbitMQSerivce();
    const result = await rabbitMQService.sendAndReceive('updateTask', payload, requestId);

    if (result) {
      res.json({ message: 'Task updated successfully.', task: result });
    } else {
      res.status(500).json({ error: 'No response received from Microservice M2.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
});


router.delete('/tasks/:id', async (req, res) => {
  try {
    const taskIdParam = req.params.id;
    const requestId = req.headers['request_id'] as string;
    const payload: DeleteTaskPayload = { id: taskIdParam };
    const rabbitMQService = await getRabbitMQSerivce();
    const result = await rabbitMQService.sendAndReceive('deleteTask', payload, requestId);

    if (result) {
      res.json({ message: 'Task deleted successfully.' });
    } else {
      res.status(500).json({ error: 'No response received from Microservice M2.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
});

export default router;
