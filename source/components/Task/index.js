// Core
import React, { PureComponent, createRef } from 'react';
import cx from 'classnames';

// Instruments
import Styles from './styles.m.css';
import Checkbox from '../../theme/assets/Checkbox';
import Star from '../../theme/assets/Star';
import Edit from '../../theme/assets/Edit';
import Remove from '../../theme/assets/Remove';

export default class Task extends PureComponent {

    state = {
        isTaskEditing: false, // булевое свойство, описывающее состояние задачи — редактируемое или не редактируемое
        completed:     false,
        newMessage:    this.props.message, // строковое свойство, описывающее измененный новый текст для обновления задачи, последующей отправкой этой строки на сервер
    };

    taskInput = createRef();

    _setTaskEditingState = (state) => {
        console.log(this.state.isTaskEditing);

        this.setState({
            isTaskEditing: state,
        });

        if (state) {
            this.taskInput.current.disabled = !state;

            this.taskInput.current.focus();

            console.log(this.state.isTaskEditing);
        }
        console.log(this.state.isTaskEditing);
    };

    _updateNewTaskMessage = (event) => {
        const { value: newMessage } = event.target;

        this.setState({
            newMessage,
        });
    };

   _updateTask = () => {
       if (this.props.message === this.state.newMessage) {
           this._setTaskEditingState(false);

           return null;
       }
       this.props._updateTaskAsync(this._getTaskShape({ 'message': this.state.newMessage }));
       this._setTaskEditingState(false);
   };

   _updateTaskMessageOnClick = () => {
       if (!this.state.isTaskEditing) {
           this._setTaskEditingState(true);
       } else {
           this._updateTask();

           return null;
       }
   };

   _cancelUpdatingTaskMessage = () => {
       this.setState({
           isTaskEditing: false,
           newMessage:    this.props.message,
       });
   };

   _updateTaskMessageOnKeyDown = (event) => {
       if (this.state.newMessage !== '') {
           if (event.key === 'Enter') {
               this._updateTask();
           } else if (event.key === 'Escape') {
               this._cancelUpdatingTaskMessage();
           }
       } else {
           return null;

       }
   };

    _toggleTaskCompletedState = () => {
        this.props._updateTaskAsync(
            this._getTaskShape({ 'completed': !this.props.completed })
        );
    };

    _toggleTaskFavoriteState = () => {
        this.props._updateTaskAsync(
            this._getTaskShape({ 'favorite': !this.props.favorite })
        );
    };

    _removeTask = () => {
        this.props._removeTaskAsync(this.props.id);
    };

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    render () {
        const { isTaskEditing, newMessage } = this.state;
        const { completed, favorite } = this.props;

        const styles = cx(Styles.task, {
            [Styles.completed]: completed,
        });


        return (
            <>
                <li className = { styles }>
                    <div className = { Styles.content }>
                        <Checkbox
                            inlineBlock
                            checked = { completed }
                            className = { Styles.toggleTaskCompletedState }
                            color1 = '#3B8EF3'
                            color2 = '#FFF'
                            onClick = { this._toggleTaskCompletedState }
                        />
                        <input
                            disabled = { !isTaskEditing }
                            maxLength = { 50 }
                            ref = { this.taskInput }
                            type = 'text'
                            value = { newMessage }
                            onChange = { this._updateNewTaskMessage }
                            onKeyDown = { this._updateTaskMessageOnKeyDown }
                        />
                    </div>
                    <div className = { Styles.actions }>
                        <Star
                            inlineBlock
                            checked = { favorite }
                            className = { Styles.toggleTaskFavoriteState }
                            color1 = '#3B8EF3'
                            color2 = '#000'
                            onClick = { this._toggleTaskFavoriteState }
                        />
                        <Edit
                            inlineBlock
                            checked = { isTaskEditing }
                            className = { Styles.updateTaskMessageOnClick }
                            color1 = '#3B8EF3'
                            color2 = '#000'
                            onClick = { this._updateTaskMessageOnClick }
                        />
                        <Remove
                            inlineBlock
                            className = { Styles.removeTask }
                            color1 = '#3B8EF3'
                            color2 = '#000'
                            onClick = { this._removeTask }
                        />
                    </div>
                </li>
            </>
        );
    }
}
