let projects = [];
projects = document.querySelectorAll('.project');

projects.id = 0;
projects.state = [
    [0, 0],
    [1, 0],
    [2, 0]
];

projects[0].addEventListener("click", (change) => {projects.id = 1; changeProject();});
projects[1].addEventListener("click", (change) => {projects.id = 2; changeProject();});
projects[2].addEventListener("click", (change) => {projects.id = 3; changeProject();});

function changeProject(){

    if(projects.state[projects.id-1][1] == 1){
        projects.state[projects.id-1][1] = 0;
        document.getElementById('griddler-project' + projects.id).style.gridTemplateRows = '10vh 0 0 0';
        let elements = document.querySelectorAll('#griddler-project' + projects.id + ' .flyingUwe');
        elements.forEach(p => {p.style.translate = '-100vw 0';p.style.opacity = '0';});
        
    } else{
        
        for(var i = 0; i < projects.length; i++){
            var a = '';
            a = String(i+1);
            document.getElementById('griddler-project' + a).style.gridTemplateRows = '10vh 0 0 0';
            let elements = document.querySelectorAll('#griddler-project' + a + ' .flyingUwe');
            elements.forEach(p => {p.style.translate = '-100vw 0';p.style.opacity = '0';});
            projects.state[i][1] = 0;
        }
        document.getElementById('griddler-project' + projects.id).style.gridTemplateRows = '10vh 70vh 10vh 10vh';
        let elements = document.querySelectorAll('#griddler-project' + projects.id + ' .flyingUwe');
        elements.forEach(p => {p.style.translate = '0 0';p.style.opacity = '1';});
        projects.state[projects.id-1][1] = 1;
    };
};


// document.getElementById('griddler-project' + i).style.gridTemplateRows = '10vh 0 0 0';
// document.getElementById('griddler-project' + i).style.gridTemplateRows = '10vh 70vh 10vh 10vh';