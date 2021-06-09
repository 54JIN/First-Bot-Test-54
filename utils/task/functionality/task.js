const Task = require('../models/task')

const create_Task = async (task, owner) => {
    const taskCreate = new Task({
        description: task,
        owner
    })
    try{
        await taskCreate.save()
        return `Task Created: ${task}`
    } catch (e){
        return 'Task Not Created'
    }
}

const delete_Task = async (task, owner) => {
    try{
        await Task.findOneAndRemove({description: task, owner})
        return `Task Deleted, Current Tasks: \n${await print_Tasks(owner)}`
    } catch (e){
        console.log(e)
        return 'Task Was Not Found'
    }
}

const update_Task = async (task, owner, check) => {
    try{
        const updatingTask = await Task.findOneAndUpdate({description: task, owner}, {completed: check})
        updatingTask.save()
        return `Task Updated, \n${await print_Tasks(owner)}`
    } catch (e){
        return `Task Not Found`
    }
}

const print_Tasks = async (owner) => {
    const tasks = await Task.find({owner})
    let result = ''
    tasks.forEach((task)=> {
        const doneTask = task.completed == false? 'Uncompleted': 'Completed'
        result += `${task.description}, ${doneTask}\n`
    })
    return result == ''? 'No Tasks': result
}

module.exports = {
    create_Task,
    delete_Task,
    update_Task,
    print_Tasks
}