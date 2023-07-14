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

        const lineRadio = document.createElement('input');
        lineRadio.type = 'radio';
        lineRadio.name = 'student-group';
        lineRadio.className = 'form-check-input me-1';
        lineRadio.id = index;

        const lineText = document.createElement('label') ;
        lineText.className = 'form-check-label';
        lineText.for = index;
        lineText.innerHTML = `${el.first_name} ${el.last_name}`;

        line.appendChild(lineRadio);
        line.appendChild(lineText);
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
    })
    .catch(error => {
        console.error("Error:", error);
    });

    event.preventDefault()
    
}