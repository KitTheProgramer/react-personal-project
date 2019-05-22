// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
import Task from '../Task';
import Spinner from '../Spinner';
import Checkbox from '../../theme/assets/Checkbox';
import FlipMove from 'react-flip-move';
import { sortTasksByGroup, sortTasksByDate } from '../../instruments/helpers';

export default class Scheduler extends Component {
    state = {
        tasksFilter:     '',
        newTaskMessage:  '',
        isTasksFetching: false, //булевое свойство, описывающее состояние спиннера
        tasks:           [],
    };

    componentDidMount () {
        this._fetchTasksAsync();
    }

    _updateTasksFilter = (event) => {
        const { value } = event.target;

        this.setState({ tasksFilter: value.toLowerCase() });
    };

    _updateNewTaskMessage = (event) => {
        const { value: newTaskMessage } = event.target;

        this.setState({ newTaskMessage });
    };

    _getAllCompleted = () => {
        return this.state.tasks.every((task) => task.completed);
    };

    _setTasksFetchingState = (state) => {
        this.setState({
            isTasksFetching: state,
        });
    };

    _fetchTasksAsync = async () => {
        try {
            this._setTasksFetchingState(true);

            const tasks = await api.fetchTasks();// должен выполнить обращение к методу api.fetchTasks из модуля REST

            this.setState({ // должен обновить состояние объектами задач, полученными с API
                tasks,
                isTaskFetching: false,
            });
        } catch (error) {
            console.log(error.message);
        }
        this._setTasksFetchingState(false);
    };

    _createTaskAsync = async (event) => {
        try {
            this._setTasksFetchingState(true);
            const { newTaskMessage } = this.state;

            if (newTaskMessage) {
                event.preventDefault(); //должен вызывать метод preventDefault синтетического события будучи (225 строка тестов)
                const task = await api.createTask(newTaskMessage); //вызванным в качестве обработчика события onSubmit, когда state.newTaksMessage — не пустая строка

                this.setState((prevState) => ({
                    tasks:          [task, ...prevState.tasks],
                    newTaskMessage: '',
                }));
            } else {
                return null;
            }
        } catch (error) {
            console.log(error.message);
        }
        this._setTasksFetchingState(false);
    };

    _updateTaskAsync = async (changedTask) => {
        try {
            this._setTasksFetchingState(true);
            const updatedTask = await api.updateTask(changedTask);

            this.setState((prevState) => ({
                tasks: [...prevState.tasks.map((task) => {
                    if (task.id === updatedTask.id) {
                        return updatedTask;
                    }

                    return task;
                })],
            }));

            // должен обратится к методу api.updateTask из модуля REST, передав ему аргументом объект задачи changedTask
        } catch (error) {
            console.log(error.message);
        }
        this._setTasksFetchingState(false);
    };

    _removeTaskAsync = async (taskId) => {
        this._setTasksFetchingState(true);
        try {
            await api.removeTask(taskId);

            this.setState((prevState) => ({
                tasks:          prevState.tasks.filter(({ id }) => id !== taskId),
                isTaskFetching: false,
            }));

            //должен выполнить обращение к методу api.removeTask из модуля REST, передав ему аргументом при вызове идентификатор задачи для удаления
            //должен удалить из локального состояния задачу, если задача успешно была удалена на сервере

        } catch (error) {
            console.log(error.message);
        }
        this._setTasksFetchingState(false);
    };

    _completeAllTasksAsync = async () => {
        if (this._getAllCompleted()) {
            return null;
        }

        this._setTasksFetchingState(true);

        try {
            await api.completeAllTasks([...this.state.tasks.filter((task) => !task.completed)]);

            this.setState((prevState) => ({
                tasks: [...prevState.tasks.map((task) => ({ ...task, completed: true }))],
            }));
        } catch (error) {
            console.log(error.message);
        }
        this._setTasksFetchingState(false);

        // не должен выполнять обращение к api.completeAllTasks и должен вернуть null, если все задачи в state.tasks — выполнены
        // а также — должен обратится к api.completeAllTasks, передав в качестве аргумента массив с не выполненными задачи из состояния
    };

    render () {
        const { newTaskMessage, tasks, tasksFilter } = this.state;
        const tasksJSX = sortTasksByGroup(tasks.filter((task) => task.message.toLowerCase().includes(tasksFilter))).map((task) => (
            <Task
                key = { task.id }
                { ...task }
                _removeTaskAsync = { this._removeTaskAsync }
                _updateTaskAsync = { this._updateTaskAsync }
            />
        ));
        const allCompleted = this._getAllCompleted();

        return (
            <section className = { Styles.scheduler }>
                <Spinner isSpinning = { this.state.isTasksFetching } />
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input
                            onChange = { this._updateTasksFilter }
                            placeholder = { 'Поиск' }
                            type = { 'search' }
                            value = { tasksFilter }
                        />
                    </header>
                    <section>
                        <form onSubmit = { this._createTaskAsync }>
                            <input
                                className = { 'createTask' }
                                maxLength = { 50 }
                                placeholder = { 'Описaние моей новой задачи' }
                                type = { 'text' }
                                value = { newTaskMessage }
                                onChange = { this._updateNewTaskMessage }
                            />
                            <button>
                                Добавить задачу
                            </button>
                        </form>
                        <div className = { 'overlay' }>
                            <ul>
                                <FlipMove
                                    duration = { 400 }
                                    easing = { 'ease-in-out' }>
                                    {tasksJSX}
                                </FlipMove>
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            checked = { allCompleted }
                            color1 = '#363636'
                            color2 = '#fff'
                            onClick = { this._completeAllTasksAsync }
                        />
                        <span
                            className = { Styles.completeAllTasks }>
                            Все задачи выполнены
                        </span>
                    </footer>
                </main>
            </section>
        );
    }
}
