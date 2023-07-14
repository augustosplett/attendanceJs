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