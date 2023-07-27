# Start
`docker compose up --build`

## Postman import
`
    {
	"info": {
		"_postman_id": "3b581d93-b7db-4b12-9e9e-2926aac3e6ee",
		"name": "Task",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
		"_exporter_id": "4773870"
	},
	"item": [
		{
			"name": "Get tasks",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "localhost:3000/tasks",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"tasks"
					]
				}
			},
			"response": []
		},
		{
			"name": "Creat task",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"title\":\"Test\",\n    \"description\":\"new Task\"\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "localhost:3000/tasks",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"tasks"
					]
				}
			},
			"response": []
		},
		{
			"name": "Task update",
			"request": {
				"method": "PUT",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"title\":\"Test1\",\n    \"description\":\"desk\"\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "localhost:3000/tasks/1",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"tasks",
						"1"
					]
				}
			},
			"response": []
		},
		{
			"name": "Task delete",
			"request": {
				"method": "DELETE",
				"header": [],
				"url": {
					"raw": "localhost:3000/tasks/1",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"tasks",
						"1"
					]
				}
			},
			"response": []
		}
	]
}
`
