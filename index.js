
const addTaskbtn = document.getElementById('add_task')
const taskInput = document.getElementById('desc_task')
const addedTasks = document.querySelector('.added__tasks')

const btnsFilter = document.querySelectorAll('.btn-light')
 


let tasksList;
!localStorage.tasks ? tasksList = [] : tasksList = JSON.parse(localStorage.getItem('tasks'));

let addedTasksElem = [];

class Modal {
    constructor (index) {
        this.index = index,
        this.init();
    }

    init () {
        this.createMarkUp();
        this.modal = document.querySelector('.myModal');
        this.closeBtn = this.modal.querySelector('.close');
        this.confirmBtn = this.modal.querySelector('.confirm')
        this.modal.classList.add('show');
        this.modal.style = "display: block"
        this.attachEvents();
    }

    createMarkUp () {
        addedTasks.insertAdjacentHTML('beforebegin', `
        <div class="modal myModal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">Attention</h5>
             
            </div>
            <div class="modal-body">
            Do you want to delete this task?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary close" data-bs-dismiss="modal">No</button>
              <button type="button" class="btn btn-primary confirm">Yes</button>
            </div>
          </div>
        </div>
      </div>
        `)
    }

    attachEvents () {
        this.closeFn = this.closeFn.bind(this);
        this.deleteFn = this.deleteFn.bind(this);
        this.closeBtn.addEventListener('click', this.closeFn);
        this.confirmBtn.addEventListener('click', this.deleteFn)
    }
    

    dettachEvents () {
        this.closeBtn.removeEventListener('click', this.closeFn);
        this.confirmBtn.removeEventListener('click', this.deleteFn)
    }

    closeFn () {
        this.dettachEvents();
        this.modal.remove();
        this.modal = null;
    }

    deleteFn () {
        tasksList.splice(this.index, 1);
        uploadLocal();
        createHtmlList();
        this.closeFn();
    }
}



function Task(description) {
    this.description = description;
    this.complete = false;
}

const createTemplate = (task, index) => {
    return `
        <div class="task__item ${task.complete ? 'checked' : ''}">
            <div class="description">
                ${task.description}
            </div>
            <div class="buttons btn-group" role="group">
                <input onclick="completeTask(${index})" class="btn-check" id="btn-check-${index}-outlined" type="checkbox" ${task.complete ? 'checked' : ''}>
                <label class="btn btn-outline-secondary" for="btn-check-${index}-outlined">Checked</label><br>
                
                <button onclick="deleteTask(${index})" class="delete btn btn-danger" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Delete</i></button>
            </div> 
        </div>    
    `
}

const filterTasks = () => {
    const [btnActive, btnComplete, btnAll] = btnsFilter
    btnActive.addEventListener('click', () => {
        document.querySelectorAll('.task__item').forEach(elem => {
            if (elem.classList.contains('checked')) {
                elem.style = 'display:none'
            } else elem.style = 'display:flex'
        })
    })
    btnComplete.addEventListener('click', () => {
        document.querySelectorAll('.task__item').forEach(elem => {
            if (!elem.classList.contains('checked')) {
                elem.style = 'display:none'
            } else elem.style = 'display:flex'
        })
    })
    btnAll.addEventListener('click', () => {
        document.querySelectorAll('.task__item').forEach(elem => {
            elem.style = 'display:flex'
        })
    })
}

const createHtmlList = () => {
    addedTasks.innerHTML = "";
    if (tasksList.length > 0) {
        filterTasks();
        tasksList.forEach((item, index) => {
            addedTasks.innerHTML += createTemplate(item, index);
        });
        addedTasksElem = document.querySelectorAll(".task__item");
        addedTasksElem.forEach((elem, index) => {
            let div = addedTasksElem[index].firstElementChild
            elem.addEventListener('dblclick', () => {
                let textArea = document.createElement('textarea')
                textArea.className = 'form-control';
                console.log(elem)
                textArea.value = elem.firstElementChild.innerText;
                textArea.onkeydown = function (event) {
                    if (event.key === 'Enter') {
                        this.blur()
                    }
                }
                textArea.onblur = function () {
                    div.innerHTML = textArea.value
                    tasksList[index].description = textArea.value
                    textArea.replaceWith(div)
                    uploadLocal()
                    
                }
                elem.firstElementChild.replaceWith(textArea)
                textArea.focus()
            })
        })
         
    }
    if (addedTasks.childElementCount > 0) {
        btnsFilter.forEach((elem) => {
            elem.style="display: inline"
        })
    } else {
        btnsFilter.forEach((elem) => {
            elem.style="display: none"
        })
    }
    
}

createHtmlList();

const uploadLocal = function() {
    localStorage.setItem('tasks', JSON.stringify(tasksList))
};

const completeTask = (index) => {
    tasksList[index].complete = !tasksList[index].complete;
    if (tasksList[index].complete) {
        addedTasksElem[index].classList.add('checked');}
        else {
        addedTasksElem[index].classList.remove('checked');
        }
    uploadLocal();
    createHtmlList();
};

addTaskbtn.addEventListener('click', () => {
    if (taskInput.value) {
        tasksList.push(new Task(taskInput.value));
        uploadLocal();
        createHtmlList();
        taskInput.value = '';
    } else alert ('Input field is empty')
});

const deleteTask = (index) => {
    new Modal (index);
}



const handleKey = (event) => {
    if (event.key === 'Enter') {
        if (taskInput.value){
            tasksList.push(new Task(taskInput.value));
            uploadLocal();
            createHtmlList();
            taskInput.value = '';
        } else alert ('Input field is empty')
    }
}

taskInput.addEventListener('keydown', handleKey)

