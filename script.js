let projects = [];
let scrollDiv;
let elements;

projects = document.querySelectorAll('.project');

projects.id = 0;
projects.state = [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0]
];

projects[0].addEventListener("click", (change) => {projects.id = 1; changeProject(); });
projects[1].addEventListener("click", (change) => {projects.id = 2; changeProject(); });
projects[2].addEventListener("click", (change) => {projects.id = 3; changeProject(); });
projects[3].addEventListener("click", (change) => {projects.id = 4; changeProject(); });
projects[4].addEventListener("click", (change) => {projects.id = 5; changeProject(); });

function changeProject(){

    if(projects.state[projects.id-1][1] == 1){
        projects.state[projects.id-1][1] = 0;
        document.getElementById('griddler-project' + projects.id).style.gridTemplateRows = '10vh 0 0 0';
        elements = document.querySelectorAll('#griddler-project' + projects.id + ' .flyingUwe');
        elements.forEach(p => {p.style.translate = '-100vw 0';p.style.opacity = '0';});
        scrollTo({top: 0, behavior: 'smooth'});

        document.body.style.overflowY = 'auto';
        document.body.style.maxHeight = 'none';
        document.body.style.minHeight = '150vh';
    } else{

        document.body.style.overflowY = 'hidden';
        document.body.style.maxHeight = '100vh';
        document.body.style.minHeight = 'none';

        for(var i = 0; i < projects.length; i++){
            var a = '';
            a = String(i+1);
            document.getElementById('griddler-project' + a).style.gridTemplateRows = '10vh 0 0 0';
            elements = document.querySelectorAll('#griddler-project' + a + ' .flyingUwe');
            elements.forEach(p => {p.style.translate = '-100vw 0';p.style.opacity = '0';});
            projects.state[i][1] = 0;
        }
        document.getElementById('griddler-project' + projects.id).style.gridTemplateRows = '10vh 74vh 8vh 8vh';
        elements = document.querySelectorAll('#griddler-project' + projects.id + ' .flyingUwe');
        elements.forEach(p => {p.style.translate = '0 0';p.style.opacity = '1';});
        projects.state[projects.id-1][1] = 1;

        scrollDiv = document.getElementById('griddler-project' + projects.id).offsetTop;
        scrollTo({top: scrollDiv, behavior: 'smooth'});
    };


};


// document.getElementById('griddler-project' + i).style.gridTemplateRows = '10vh 0 0 0';
// document.getElementById('griddler-project' + i).style.gridTemplateRows = '10vh 70vh 10vh 10vh';