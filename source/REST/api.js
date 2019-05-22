import { MAIN_URL, TOKEN } from './config';

export const api = {
    async fetchTasks (size=10, page=1, search='') {
        const response = await fetch(`${MAIN_URL}?size=${size}&page=${page}&search=${search}`, {
            method:  'GET',
            headers: {
                authorization: TOKEN,
            },
        });

        if (response.status !== 200) {
            throw new Error('Tasks were not loaded.');
        }

        const { data: tasks } = await response.json();

        return tasks;
    },

    async createTask (message) {
        const response = await fetch(MAIN_URL, {
            method:  'POST',
            headers: {
                authorization:  TOKEN,
                'content-type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (response.status !== 200) {
            throw new Error('Task was not loaded.');
        }

        const { data: task } = await response.json();

        return task;
    },

    async updateTask (taskShape) {
        const response = await fetch(MAIN_URL, {
            method:  'PUT',
            headers: {
                authorization:  TOKEN,
                'content-type': 'application/json',
            },
            body: JSON.stringify([taskShape]),
        });

        if (response.status !== 200) {
            throw new Error('Task was not updated.');
        }

        const { data: task } = await response.json();

        return task[0];
    },

    async removeTask (taskId) {
        const response = await fetch(`${MAIN_URL}/${taskId}`, {
            method:  'DELETE',
            headers: {
                authorization: TOKEN,
            },
        });

        if (response.status !== 204) {
            throw new Error('Task was not deleted.');
        }
    },

    async completeAllTasks (tasks) {
        const toUpdate = tasks.map((task) => {
            return fetch(MAIN_URL, {
                method:  'PUT',
                headers: {
                    authorization:  TOKEN,
                    'content-type': 'application/json',
                },
                body: JSON.stringify([{ ...task, completed: true }]),
            });
        });

        await Promise.all(toUpdate);
    },
};
