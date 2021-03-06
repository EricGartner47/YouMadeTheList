
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { deleteTask, loadTasks, loadListTasks, updateTask } from '../../store/tasks';
import { loadLists } from '../../store/lists'
import { usePage } from '../../context/AppContext';
import './TaskFormUpdate.css'

const TaskFormUpdate = ({ task, setSelectedTask, currentList }) => {
    const user = useSelector(state => state.session.user);
    const lists = useSelector(state => state.lists);
    const { list, setList } = usePage()
    const userLists = Object.values(lists)
    const [taskName, setTaskName] = useState(task.name);
    const [notes, setNotes] = useState(task.notes || "");
    const [dueDate, setDueDate] = useState(task.due_date || "hello");
    const [completed, setCompleted] = useState(task.completed || false);
    let [listId, setListId] = useState(task.list_id);
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        setTaskName(task.name);
        setNotes(task.notes);
        setDueDate(task.due_date || "");
        setCompleted(task.completed);
        setListId(task.list_id);
    }, [task])

    const removeTaskButton = async e => {
        await dispatch(deleteTask(task))
        if (listId) {
            dispatch(loadListTasks(user, listId))
        } else dispatch(loadTasks(user))
        setSelectedTask()
    }

    const handleSubmit = async e => {
        e.preventDefault();
        let payload;

        if (listId === "select") {
            listId = null;
        }

        if (errors.length > 0) {
            return
        } else if (taskName.length === 0) {
            setErrors(["Task name is required"])
            return
        } else {
            payload = {
                id: task.id,
                user_id: user.id,
                name: taskName,
                notes,
                due_date: dueDate,
                completed,
                list_id: listId
            }
            const updatedTask = await dispatch(updateTask(payload)).catch(async (res) => {
                const data = await res.json()
                if (data && data.errors) setErrors(data.errors)
                return
            })
            dispatch(loadLists(user))
            if (list && list.id === payload.list_id) {
                dispatch(loadListTasks(user, list))
            } else if (list && listId) {
                setList(lists[updatedTask.list_id])
                dispatch(loadListTasks(user, lists[updatedTask.list_id]))
            }
            else {
                dispatch(loadTasks(user))
            }
            setSuccess(updatedTask.name);
            const timeout = setTimeout(function () {
                setSuccess(false);
            }, 2000);

            return () => clearTimeout(timeout);
        }
    }
    
    if (user) {
        return (
            <div id="task-update-panel">
                {success &&
                    <div id="success-container">
                        <div className="success-message">You have successfully updated "{success}".</div>
                    </div>
                }
                <i className="fas fa-trash" onClick={removeTaskButton}></i>
                {errors.map((error, idx) => <div className="task-update-error" key={idx}>{error}</div>)}
                <div id="task-update-form">
                    <form onSubmit={handleSubmit}>
                        <div id="task-name-container">
                            <label htmlFor="task-name" id="label-task-name">Name Your Task</label>
                            <input
                                id="input-task-name"
                                name="task-name"
                                type='text'
                                placeholder='Add a Task...'
                                value={taskName}
                                onChange={e => {
                                    setTaskName(e.target.value)
                                    if (e.target.value.length === 0) setErrors(["Task name is required"])
                                    else if (e.target.value.length > 200) setErrors(["Task name must be 200 characters or fewer"])
                                    else setErrors([])
                                }}
                            />
                        </div>

                        <div className="fields">
                            <div className="field-container">
                                <label htmlFor="task-due-date">due</label>
                                <input
                                    id="task-due-date"
                                    name="task-due-date"
                                    type='date'
                                    value={dueDate}
                                    onChange={e => setDueDate(e.target.value)}
                                />
                            </div>

                            <div className="field-container">
                                <label htmlFor="list-select">list</label>
                                <select
                                    id="list-select"
                                    name="list-select"
                                    value={listId || "select"}
                                    onChange={e => { setListId(e.target.value) }}
                                >
                                    <option value={"select"}>Inbox</option>
                                    {userLists.map(list => {
                                        return <option key={list.id} value={list.id}>{list.name}</option>
                                    })}
                                </select>
                            </div>

                            <div className="field-container">
                                <label htmlFor="task-completed">complete</label>
                                <input
                                    id="task-completed"
                                    name="task-completed"
                                    type='checkbox'
                                    checked={completed}
                                    onChange={e => setCompleted(!completed)}
                                />
                            </div>

                        </div>

                        <div id="notes-container">
                            <label htmlFor="task-notes" id="label-notes">Notes</label>
                            <br />
                            <textarea
                                id="task-notes"
                                name="task-notes"
                                value={notes || ""}
                                onChange={e => setNotes(e.target.value)}
                                rows={3}
                                cols={5}
                                placeholder="Add a note..."
                            />
                        </div>
                        <button type='submit' className="button-update-task">Save</button>
                        <button type="button" id="task-update-cancel-button" onClick={() => setSelectedTask()}>Cancel</button>
                    </form>
                </div>
            </div>
        )
    }

    else return (
        <Redirect to="/login" />
    );
}



export default TaskFormUpdate;
