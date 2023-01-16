const studentTableBody = document.getElementById("student-table-body");

var students = [
    { "name": "John Doe", "roll": 1, "marks": 85 },
    { "name": "Jane Smith", "roll": 2, "marks": 90 },
    { "name": "Bob Johnson", "roll": 3, "marks": 80 },
    { "name": "Alice Brown", "roll": 4, "marks": 75 },
    { "name": "Charlie Davis", "roll": 5, "marks": 70 }
];

for (var i = 0; i < students.length; i++) {
    var student = students[i];
    var row = document.createElement("tr");

    var nameCell = document.createElement("td");
    nameCell.innerHTML = student.name;
    row.appendChild(nameCell);

    var rollCell = document.createElement("td");
    rollCell.innerHTML = student.roll;
    row.appendChild(rollCell);

    var marksCell = document.createElement("td");
    marksCell.innerHTML = student.marks;
    row.appendChild(marksCell);

    var answersCell = $('<td><div class="box" style="width:40px; height:40px;"><div></td>');
    $(row).append(answersCell);

    studentTableBody.appendChild(row);
}