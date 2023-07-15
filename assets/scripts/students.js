async function getStudentsList(){
    data = fetch('http://localhost:5000/student')
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

    //creating the elements tha will be inserted on the list
    data.forEach((el, index) => {
        const line = document.createElement('li');
        line.className = 'list-group-item';
        line.style.display = 'flex';
        line.style.justifyContent = 'space-between'

        const studentName = document.createElement('span')
        studentName.id = index;
        studentName.innerHTML = `${el.first_name} ${el.last_name}`;

        studentContainer = document.createElement('div')
        studentContainer.className = 'container';
        studentContainer.style.display = 'inline';
        studentContainer.appendChild(studentName)

        const delButton = document.createElement('button')
        delButton.className = 'btn btn-danger';
        delButton.innerText = 'DEL';
        delButton.style.marginLeft = '10px';
        delButton.id = `btn-del-${index}`
        delButton.addEventListener("click", async function() {
            url = `http://localhost:5000/student/${index}`

            await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }}
            )
            await updateStudentsList()
        });

        const editButton = document.createElement('button')
        editButton.className = 'btn btn-danger';
        editButton.innerText = 'EDIT';
        editButton.style.marginLeft = '10px';
        editButton.id = `btn-edit-${index}`
        editButton.addEventListener("click", async function() {
            data = await fetch(`http://localhost:5000/student/${index}`)
            .then(request => request.json())
            console.log(data);
            document.getElementById('first-name').value = data.first_name
            document.getElementById('last-name').value = data.last_name
            document.getElementById('email').value = data.email
            document.getElementById('student-id').value = index
        });

        btnContainer = document.createElement('div')
        btnContainer.className = 'container';
        btnContainer.style.display = 'inline';       
        btnContainer.style.display = 'flex';
        btnContainer.style.justifyContent = 'flex-end'
        btnContainer.appendChild(delButton);
        btnContainer.appendChild(editButton);


        line.appendChild(studentContainer);
        line.appendChild(btnContainer)
        
        listOfStudents.appendChild(line);
    })
}

async function insertStudent(){
    
    first_name = document.getElementById('first-name').value
    last_name = document.getElementById('last-name').value
    email = document.getElementById('email').value

    var url = "http://localhost:5000/student"; 

    var data = {
        first_name: first_name,
        last_name: last_name,
        email: email
    };

    fetch(url, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log("API response:", result);
        updateStudentsList();
        cleanForm();
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

    var url = `http://localhost:5000/student/${id}`; 

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
    .then(response => response.json())
    .then(result => {
        console.log("API response:", result);
        updateStudentsList();
        cleanForm();
    })
    .catch(error => {
        console.error("Error:", error);
    });
    
}

function cleanForm(){
    document.getElementById('first-name').value = ""
    document.getElementById('last-name').value = ""
    document.getElementById('email').value = ""
    document.getElementById('student-id').value = ""
}