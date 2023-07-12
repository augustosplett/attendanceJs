async function getStudentsList(){
    console.log("chamou api")
    data = fetch('http://localhost:5000/student')
    .then(request => request.json())
    return data;
}

async function updateStudentsList(){
    listOfStudents = document.getElementById('students-list')

    data = await getStudentsList()
    data.forEach(el => {
        console.log(el[1])
        const line = document.createElement('li');
        line.className = 'list-group-item';

        const lineRadio = document.createElement('input');
        lineRadio.type = 'radio';
        lineRadio.name = 'student-group';
        lineRadio.className = 'form-check-input me-1';
        lineRadio.id = el[0];

        const lineText = document.createElement('label') ;
        lineText.className = 'form-check-label';
        lineText.for = el[0];
        lineText.innerHTML = `${el[1]} ${el[2]}`;

        line.appendChild(lineRadio);
        line.appendChild(lineText);
        listOfStudents.appendChild(line);
    })
}