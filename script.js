document.addEventListener("DOMContentLoaded", () => {

  const taskInput = document.getElementById('taskInput');
  const taskInputPanel = document.getElementById('add-hidden');
  const newTaskBtn = document.getElementById('new-task-btn');
  const cancelBtn = document.getElementById("btn-cancel");
  const addBtn = document.getElementById('btn-add-task');
  const taskList = document.getElementById('task-grid');
  const searchInput = document.getElementById('search-task');
  const hrefItems = document.querySelectorAll('.sidebar-item');
  const currentView = document.getElementById('current-task');
  const themeToggle = document.getElementById('theme-toggle');

  //state
   let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
   let filter = 'All';
   let searchTerm = '';
   
   //Helper functions

   const toggleTheme = () =>{
    const isDarkMode = document.body.classList.toggle('dark-mode');
    themeToggle.innerHTML = isDarkMode? 
        '<i class="fas fa-sun"> </i>':
        '<i class="fas fa-moon"> </i>';
    localStorage.setItem('theme',
         isDarkMode?'dark':'light');
   }

   const savedTheme = localStorage.getItem('theme');
   if(savedTheme ==='dark'){
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun "></i>';
   }

    const toggleTaskInputPanel =() =>{  
       taskInputPanel.classList.toggle('hidden');
       if(!taskInputPanel.classList.contains('hidden')){
        taskInput.focus();
       }
    };

    const saveTasks = () => {
        localStorage.setItem ('tasks', JSON.stringify(tasks));
    };

    const filterAndSearchTask = () => {
        let filteredTasks = tasks;

        if(filter !== 'All' ) {
            filteredTasks = filteredTasks.filter( 
                task => filter === 'Active' ? !task.completed : task.completed
            );
        }

        if(searchTerm){
            const term = searchTerm.toLowerCase();
            filteredTasks = filteredTasks.filter(
                task => task.text.toLowerCase().includes(term)
            );
        }
        return filteredTasks;
    }

    const toggleTaskComplete = (index) =>{
        tasks[index].completed = !tasks[index].completed;
        console.log("completed toggle ",tasks[index].completed);
        saveTasks();
        renderTasks();
    }

    const editTask = (index) =>{
        newText = prompt('Edit task:', tasks[index].text);
        if(newText !== null && newText.trim() !== ''){
            tasks[index].text = newText.trim();
            tasks[index].updated = new Date().toLocaleDateString();
            saveTasks();
            renderTasks();
        }
    }

    const deleteTask = (index) => {
        if(confirm('Are u sure you want to delete this task?')){
            tasks.splice(index,1);
            saveTasks();
            renderTasks();
        }
    }

    const renderTasks = () => {
        taskList.innerHTML = '';
        const filteredTasks = filterAndSearchTask();
        if(filteredTasks.length === 0){
            const emptyState = document.createElement('div');
            emptyState.className ='empty-state';
            emptyState.innerHTML = `<i class="fas fa-clipboard-list" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
            <p style="color: var(--text-secondary)"> No tasks found </p>
            `;
            emptyState.style.textAlign = 'center';
            emptyState.style.padding = '4rem';
            emptyState.style.gridColumn = '1 / -1';
            taskList.appendChild(emptyState);
        }
        
        filteredTasks.forEach((task,index)=>{
            const taskCard = document.createElement('div');
            taskCard.className = `task-card ${task.completed? 'completed':''}`; // if task.completed = true , completed 
            taskCard.dataset.id=index;

            const taskHeader = document.createElement('div');
            taskHeader.className='task-header';

            const checkbox = document.createElement('input');
            checkbox.type='checkbox';
            checkbox.className = 'task-checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', ()=> toggleTaskComplete(index));

            const taskContent = document.createElement('div');
            taskContent.className='task-content';
    
            const taskText = document.createElement('p');
            taskText.className = 'task-text';
            taskText.textContent = task.text;

            const taskDate = document.createElement('p');
            taskDate.className='task-date';
            taskDate.textContent = task.date ;
            taskDate.style.fontSize = '0.75rem';
            taskDate.style.color='var (--text-secondary)';

            const taskFooter = document.createElement('div');
            taskFooter.className = 'task-footer';
            
            const editBtn =document.createElement('button');
            editBtn.className ='editBtn';
            editBtn.innerHTML ='<i class="fas fa-edit"></i>';
            editBtn.addEventListener('click',()=> {
                editTask(index);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'deleteBtn';
            deleteBtn.innerHTML ='<i class="fas fa-trash-alt"></i>';
            deleteBtn.addEventListener('click',()=> deleteTask(index));
            
            taskHeader.appendChild(checkbox);
            taskContent.appendChild(taskText);
            taskContent.appendChild(taskDate);
            taskFooter.appendChild(editBtn);
            taskFooter.appendChild(deleteBtn);
            taskCard.appendChild(taskHeader);
            taskCard.appendChild(taskContent);
            taskCard.appendChild(taskFooter);
            taskList.appendChild(taskCard);
        });
        console.log(tasks);
    }

    const addTask = () => {
        const taskText = taskInput.value.trim();
        
        if(taskText){
            tasks.push({
                text: taskText,
                completed:false,
                date : new Date().toLocaleDateString(),
                id : Date.now()
            });
            taskInput.value= '';
            toggleTaskInputPanel();
            saveTasks();
            renderTasks();
        }

    }

   // Event Listeners
    newTaskBtn.addEventListener('click',toggleTaskInputPanel);
    cancelBtn.addEventListener('click', toggleTaskInputPanel)
    addBtn.addEventListener('click', addTask);
    themeToggle.addEventListener('click', toggleTheme);

    taskInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') {
            addTask();
        }
    });

    hrefItems.forEach(item=>{
        item.addEventListener('click', () => {
            hrefItems.forEach( a => a.classList.remove('active'));
            item.classList.add('active');
            filter = item.dataset.filter;
            currentView.textContent = item.querySelector('span').textContent; 
            renderTasks();
            console.log( currentView.textContent);
        });
    });

    searchInput.addEventListener('input',(e) => {
        searchTerm = e.target.value;
        renderTasks();
    })
  
    renderTasks();
});
/* function addTask(){
    const taskInput = document.getElementsByClassName('taskInput');

    const taskTextCheck = taskInput.value.split(" ");
    const taskText = taskInput.value.trim();

    if(taskText === ''){
        alert('please enter a task');
        return;
    }

    if(taskTextCheck.length >10){
        alert('Please Limit your task to 10 words or fewer');
        return;
    }

    const taskList = document.getElementById('taskList');
    const listItem = document.createElement('li');

    const itemCount = taskList.getElementsByTagName('li').length;
    console.log(itemCount);

    if (itemCount > 2) {
        alert('Maximum of 3 tasks allowed.');
        return; // Stop adding more items
}
    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;
    taskSpan.className ="list-text";

    const completeButton = document.createElement('button');
    completeButton.innerHTML= '✔';
    completeButton.onclick= () =>{
        taskSpan.classList.toggle('completed');
        updateComplete();
    }

    const removeBtn = document.createElement('button');
    removeBtn.textContent='remove';
    removeBtn.className = "remove-btn";
    removeBtn.onclick = () =>{
        taskList.removeChild(listItem);
        
    }

    const editBtn = document.createElement('button');
    editBtn.textContent='edit';
    editBtn.className = 'edit-btn';
    editBtn.onclick =() =>{
        const update = prompt('Edit task: ',taskSpan.textContent);
        if(update!== null){
            taskSpan.textContent = update;
        
        }
    }

    listItem.appendChild(completeButton);
    listItem.appendChild(taskSpan);
    listItem.appendChild(editBtn);
    listItem.appendChild(removeBtn);
    taskList.appendChild(listItem);

    const total = taskList.getElementsByTagName('li').length;
    //console.log("total ;",total);
    const completedSpan = document.querySelectorAll("#taskList .list-text.completed").length;
    const uncompletedSpan = total -completedSpan;
    document.getElementById('uncompleted-counter').textContent = uncompletedSpan;  
    //console.log("done ;",completedSpan);
    
    function updateComplete(){
       const total = taskList.getElementsByTagName('li').length;
        const completedSpan = document.querySelectorAll("#taskList .list-text.completed").length;
        document.getElementById('completed-counter').textContent = completedSpan;
        //console.log("total inner :", total , ", done inner :",completedSpan);
        const uncompletedSpan = total - completedSpan;
        document.getElementById('uncompleted-counter').textContent = uncompletedSpan;
    }

    taskInput.value= '';
    
    
   
} */