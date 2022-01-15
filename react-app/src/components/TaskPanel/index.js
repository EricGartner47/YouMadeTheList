
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { loadTasks, createTask } from '../../store/tasks';
import './TaskPanel.css'

const filterTasks = (tasks, query) => {
    if (!query) return tasks;

    return tasks.filter((task) => {
        const taskName = task.name.toLowerCase();
        const taskNotes = task.notes?.toLowerCase();
        return taskName.includes(query.toLowerCase()) || taskNotes?.includes(query.toLowerCase())
    })
}

const TaskPanel = ({ tasks, query, setSelectedTask }) => {
    const user = useSelector(state => state.session.user);
    const [taskName, setTaskName] = useState('')
    const [errors, setErrors] = useState([])
    const [buttonSwitch, setButtonSwitch] = useState(false)
    const filteredTasks = filterTasks(tasks, query)
    const dispatch = useDispatch()

    const updateTask = (e) => {
        setTaskName(e.target.value);
    }

    useEffect(() => {
        if (!buttonSwitch) return;
        const closeActions = () => {
            setButtonSwitch(false)
        }

        document.addEventListener("click", closeActions)
        let input = document.getElementById('new-task-input');
        input.addEventListener('click', function (e) {
            setButtonSwitch(true)
            e.stopPropagation();
        }, false);

        return () => document.removeEventListener('click', closeActions)
    }, [buttonSwitch])

    const showButton = <button type='submit'>Add Task</button>;

    const handleSubmit = async e => {
        e.preventDefault();

        if (taskName.length > 200) {
            setErrors(["Task name should be fewer than 200 characters"]);
            return
        } else if (taskName.length === 0) {
            setErrors(["Task name is required"]);
            return
        } else {
            const payload = {
                name: taskName,
                user_id: user.id
            }
            await dispatch(createTask(payload, user)).catch(async(res)=> {
                const data = await res.json()
                if (data && data.errors) setErrors(data.errors)
            })
            dispatch(loadTasks(user));
        }
    }

    if (user) {
        return (
            <div id="task-list-panel">
                <h1>{user.first_name}'s Tasks</h1>
                <div id="task-bar">
                    {errors.map((error, idx) => <div key={idx}>{error}</div>)}
                    <form id="new-task-input" onSubmit={handleSubmit}>
                        <input
                            name='name'
                            type='text'
                            placeholder='Add a Task...'
                            value={taskName}
                            autoComplete="off"
                            onChange={updateTask}
                            onClick={() => setButtonSwitch(true)}
                        />
                        {buttonSwitch && showButton}
                    </form>
                </div>
                <div id="task-cards-container">
                    {filteredTasks.map(task => {
                        return (
                            <div className="task-card" key={task.id}>
                                <li 
                                    onClick={() => { 
                                        console.log(`selected task is ${task.name}`)
                                        setSelectedTask(task) }}
                                >
                                    {task.name} - {task.notes}
                                </li>
                            </div>
                        )
                    })}
                </div>

            </div>
        )
    }

    else return (
        <Redirect to="/login" />
        );
}



export default TaskPanel;
