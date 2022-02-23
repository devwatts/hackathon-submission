setInterval(getNewLogs,1000);
function getNewLogs() {
    var ajax = new XMLHttpRequest();
    ajax.open("GET", 'https://rfid-entrance-backend.herokuapp.com/logStudents?date="2022-2-22"'); //https://newcodecave.herokuapp.com/testFile
    ajax.send();
    ajax.onload = function () {
        var data = JSON.parse(this.response);
        //console.log(data);
        document.getElementById('student-container').innerHTML = ""
        for (let i = 0; i < data.length; i++) {
            var cardParent = document.createElement('div');
            cardParent.setAttribute("class", "student-card");

            cardParent.innerHTML = `
            <div class="student-image">
            <img src="https://avatars.githubusercontent.com/u/59016469?s=400&u=f9ca970c99a086e51115610dc31fa2d9b3995218&v=4" alt="">
            </div>
             <div class="student-details">
                 <div class="student-name">Dev Watts</div>
                  <div class="student-roll">1901010026</div>
                 <div class="student-course">B.TECH (CSE)</div>
                 ${data[i].entry ? '<div class="entry">ENTRY</div>':'<div class="exit">EXIT</div>'}
             </div>
            `
            document.getElementById('student-container').appendChild(cardParent)
        }
    }
}