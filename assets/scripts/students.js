async function getStudentsList(){
    data = fetch('http://localhost:3000/student')
    .then(request => request.json())
    return data;
}

function clearList(list) {
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
}

async function updateStudentsList(){
//defining the element tha will receive the students name
    listOfStudents = document.getElementById('students-list')

//clearing this list befor including new data to avoid duplication
    clearList(listOfStudents)

//getting the list of students
    data = await getStudentsList()

//creating the elements that will be inserted on the list
    data.forEach((el, index) => {
        const line = document.createElement('li');

//creating the block where I'll display the name
        line.className = 'list-group-item';
        line.style.display = 'flex';
        line.style.justifyContent = 'space-between'
        const studentName = document.createElement('span')
        studentName.id = index;
        studentName.innerHTML = `${el.first_name} ${el.last_name}`;
        const studentId = document.createElement('span')
        studentId.id = index;
        studentId.innerHTML = el.id;
        studentId.style.display = 'none';
    //adding the elements on container
        studentContainer = document.createElement('div')
        studentContainer.className = 'container';
        studentContainer.style.display = 'flex';
        studentContainer.appendChild(studentName)
        studentContainer.appendChild(studentId)

//creating the buttons
    //delete button
        const delButton = document.createElement('button')
        delButton.className = 'btn btn-danger';
        delButton.innerText = 'DEL';
        delButton.style.marginLeft = '10px';
        delButton.id = `btn-del-${index}`
        delButton.addEventListener("click", async function() {
            url = `http://localhost:3000/student/${el.id}`
            await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }}
            )
            await updateStudentsList()
        });
    //edit button
        const editButton = document.createElement('button')
        editButton.className = 'btn btn-danger';
        editButton.innerText = 'EDIT';
        editButton.style.marginLeft = '10px';
        editButton.id = `btn-edit-${index}`
        editButton.addEventListener("click", async function() {
            data = await fetch(`http://localhost:3000/student/${el.id}`)
            .then(request => request.json())
            //console.log(data);
            document.getElementById('first-name').value = data.first_name
            document.getElementById('last-name').value = data.last_name
            document.getElementById('email').value = data.email
            document.getElementById('student-id').value = data.id
        });
    //open Modal button
    const openModalButton = document.createElement('button');
    openModalButton.className = 'btn btn-danger';
    openModalButton.innerText = 'Capture Image';
    openModalButton.style.marginLeft = '10px';
    openModalButton.id = `btn-open-modal-${index}`
    openModalButton.addEventListener('click', function() {
        modal.style.display = 'block';
        console.log(el.id)
        console.log(idModal)
        idModal.innerText = el.id;
        activateCamera();
    });
    //adding buttons on cantainer
        btnContainer = document.createElement('div')
        btnContainer.className = 'container';
        btnContainer.style.display = 'inline';       
        btnContainer.style.display = 'flex';
        btnContainer.style.justifyContent = 'flex-end'
        btnContainer.appendChild(delButton);
        btnContainer.appendChild(editButton);
        btnContainer.appendChild(openModalButton);

//adding all elements on the list-item
        line.appendChild(studentContainer);
        line.appendChild(btnContainer);

        listOfStudents.appendChild(line);
    })
}

async function insertStudent(){
    
    first_name = document.getElementById('first-name').value
    last_name = document.getElementById('last-name').value
    email = document.getElementById('email').value

    var url = "http://localhost:3000/student"; 

    var data = {
        first_name: first_name,
        last_name: last_name,
        email: email
    };

    await fetch(url, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
    })
    .catch(error => {
        console.error("Error:", error);
    });

    event.preventDefault()
    
}

async function  updateStudent(){
    first_name = document.getElementById('first-name').value
    last_name = document.getElementById('last-name').value
    email = document.getElementById('email').value
    id = document.getElementById('student-id').value

    var url = `http://localhost:3000/student/${id}`; 

    var data = {
        first_name: first_name,
        last_name: last_name,
        email: email
    };

    await fetch(url, {
    method: "put",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
    })
    .catch(error => {
        console.error("Error:", error);
    });
    await updateStudentsList();
    cleanForm();
}

function cleanForm(){
    document.getElementById('first-name').value = ""
    document.getElementById('last-name').value = ""
    document.getElementById('email').value = ""
    document.getElementById('student-id').value = ""
}