
///////////////////////////////////////////////////////////////////////////////////

let mydata = {};
let pendulum = [];
let controlCircles = [];
let smallRectangles = [];
let textRectangles = [];
let fixedConstraints = [];
let numberArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
let bigCircleSize;
let mousePositionX;
let mousePositionY;
let textString = "Zu welcher Uhrzeit";
let textString2 = "habe ich am Meisten";
let textString3 = "gestreamt im Jahr 2024?";


function setup() {
  mydata = loadJSON("nachStundenSortiert.json", mydata);
  noCanvas();
}

function drawData(mydata){}

function draw(){

  // Matter.js Setup
  const { Engine, Render, Composite, Bodies, Mouse, MouseConstraint, Runner, Body } = Matter;

  // Erstelle den Engine und setze die Gravitation auf 0
  const engine = Engine.create();
  engine.world.gravity.y = 0;  // Setze die Schwerkraft auf 0 (keine Gravitation nach unten)

  // Erstelle den Renderer
  const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: window.innerWidth,
      height: window.innerHeight,
      wireframes: false,  // Setze auf false, um die Rechtecke gefüllt darzustellen
    },
  });

  // Erstelle einen MouseConstraint für die Mausinteraktion
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.01,
      render: {
        visible: true, // Verstecke die Mauslinie,
        type: 'line',
        strokeStyle: 'red',
      }
    }
  });

  const explanationRect = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight / 2 -30, 300, 200, {isStatic: true, render: {visible: true, fillStyle: 'rgba(0, 0, 0, 0)', text: {content: textString, size: 24, family: 'Rubik'}}});
  const explanationRect2 = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight / 2, 300, 200, {isStatic: true, render: {visible: true, fillStyle: 'rgba(0, 0, 0, 0)', text: {content: textString2, size: 24, family: 'Rubik'}}});
  const explanationRect3 = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight / 2 + 30, 300, 200, {isStatic: true, render: {visible: true, fillStyle: 'rgba(0, 0, 0, 0)', text: {content: textString3, size: 24, family: 'Rubik'}}});

  explanationRect.collisionFilter = {'group': -1,'category': 2,'mask': 0,};
  explanationRect2.collisionFilter = {'group': -1,'category': 2,'mask': 0,};
  explanationRect3.collisionFilter = {'group': -1,'category': 2,'mask': 0,};

if(window.innerHeight > window.innerWidth){bigCircleSize = window.innerWidth / 2.5;} else if(window.innerWidth > window.innerHeight){bigCircleSize = window.innerHeight / 2.5;};
console.log(bigCircleSize);
  const testCircle = Matter.Bodies.circle(window.innerWidth / 2, window.innerHeight / 2, bigCircleSize, {isStatic: true, render: {visible: false, fillStyle: '#ff0000'}}, [24]);
  Matter.Body.rotate(testCircle, Math.PI * 1.5);

  const testPath = Matter.Vertices.fromPath("test", testCircle);

  const rectCircle = Matter.Bodies.circle(window.innerWidth / 2, window.innerHeight / 2, bigCircleSize / 1.33, {isStatic: true, render: {visible: false, fillStyle: '#ff0000'}}, [24]);
  Matter.Body.rotate(rectCircle, Math.PI * 1.5);
  const rectPath = Matter.Vertices.fromPath("test2", rectCircle);

  const textCircle = Matter.Bodies.circle(window.innerWidth / 2, window.innerHeight / 2, bigCircleSize / 1.7, {isStatic: true, render: {visible: false, fillStyle: '#ff0000'}}, [24]);
  Matter.Body.rotate(textCircle, Math.PI * 1.5);
  const textPath = Matter.Vertices.fromPath("test3", textCircle);

for(let y = 0; y < 24; y++){

  let yPosition = textPath[0].body.vertices[y].y;
  let xPosition = textPath[0].body.vertices[y].x;

  const textRectangle = Matter.Bodies.rectangle(xPosition, yPosition, bigCircleSize / 30, bigCircleSize / 30, {isStatic: true, render: {visible: true, fillStyle: 'rgba(0, 0, 0, 0)', text: {content: numberArray[y], size: 20, family: 'Rubik'}}});

  textRectangles.push(textRectangle);
  textRectangle.collisionFilter = {'group': -1,'category': 2,'mask': 0,};

}



for(let y = 0; y < 24; y++){

  let yPosition = rectPath[0].body.vertices[y].y;
  let xPosition = rectPath[0].body.vertices[y].x;

  const smallRectangle = Matter.Bodies.rectangle(xPosition, yPosition, bigCircleSize / 7, bigCircleSize / 2 / 80, {isStatic: true, render: {visible: true, fillStyle: '#ffffff'}}, [24]);
  Matter.Body.rotate(smallRectangle, 1.65 + Math.PI * y  / 12);
  smallRectangles.push(smallRectangle);
  smallRectangle.collisionFilter = {'group': -1,'category': 2,'mask': 0,};
}

testCircle.collisionFilter = {'group': -1,'category': 2,'mask': 0,};
rectCircle.collisionFilter = {'group': -1,'category': 2,'mask': 0,};

  // Erstelle 20 kleinere Rechtecke mit weißer Füllung
  const circles = [];
for(let y = 0; y < 24; y++){
  
  let yPosition = testPath[0].body.vertices[y].y;
  let xPosition = testPath[0].body.vertices[y].x;

  const controlCircle = Matter.Bodies.circle(xPosition, yPosition, bigCircleSize / 15 + mydata[y][1]/100, { density: 10000000, isStatic: false, render: { visible: false, text: {content: mydata[y][0], size: 16}}});
  controlCircles.push(controlCircle);

  const fixedConstraint = Matter.Constraint.create({
    bodyA: controlCircles[y],
    pointB: {x: xPosition, y: yPosition},
    stiffness: 0.0001,
    render: {visible: true, strokeStyle: '#ff0000', type: 'line', lineWidth: 1},
  });
  fixedConstraints.push(fixedConstraint);

  for (let i = 0; i < mydata[y][1]/15; i++) {
    let forThisControlCircle = [];
    // colorMap = map(mydata[i][1], 102, 500, 50, 240);
    // circleSizeMap = map(mydata[i][1], 29, 1602, 25, 100);

    // Position zufällig setzen und kleinere Rechtecke erzeugen
    const circleConst = Matter.Bodies.circle(
      random(xPosition - 25, xPosition + 25),  // Zufällige X-Position
      random(yPosition - 25, yPosition + 25), // Zufällige Y-Position
      bigCircleSize / 150,  // Breite des Rechtecks
      { density: 0.00000001, isStatic: false, render: { fillStyle: '#ffffff',
                                  // text: {content: mydata[i][0] + ' ' + mydata[i][1],
                                  //         color: "#000000",
                                  //         size: circleSizeMap / 5}
                                        }
                                      }
    );
    circles.push(circleConst);
    forThisControlCircle.push(circleConst);
    let singlependulum = Matter.Constraint.create({
      bodyA: controlCircles[y],
      bodyB: circleConst,
      stiffness: 0.0005,
      lenght: 10,
      render: {visible: false, strokeStyle: '#ffffff', type: 'line', lineWidth: 1},
    });
    pendulum.push(singlependulum);
  }
};

  // Begrenze die Welt, damit die Rechtecke nicht den Render-Bereich verlassen
  // Erstelle die Kanten (Wände) der Welt
  const wallThickness = 400;
  const walls = [
    Matter.Bodies.rectangle(render.options.width / 2, 0 - wallThickness / 2, render.options.width * 2, wallThickness, { isStatic: true }),  // Oben
    Matter.Bodies.rectangle(render.options.width / 2, render.options.height + wallThickness / 2, render.options.width * 2, wallThickness, { isStatic: true }),  // Unten
    Matter.Bodies.rectangle(0 - wallThickness / 2, render.options.height / 2, wallThickness, render.options.height * 2, { isStatic: true }),  // Links
    Matter.Bodies.rectangle(render.options.width + wallThickness / 2, render.options.height / 2, wallThickness, render.options.height * 2, { isStatic: true })  // Rechts
  ];

  const mouseOverlay = Matter.Bodies.rectangle(
    mouse.position.x,
    mouse.position.y, 
    50, 
    50,
    {isStatic: false, render: {visible: false, fillStyle: '#ff0000'}});
  mouseOverlay.collisionFilter = {'group': -1,'category': 2,'mask': 0,};

  const limitMaxSpeed = (event) => {

    mouseOverlay.position.x = mouse.position.x;
    mouseOverlay.position.y = mouse.position.y;

  };

  Matter.Events.on(engine, 'beforeUpdate', limitMaxSpeed);

  // Hinzufügen der Objekte zur Welt
  Composite.add(engine.world, [...pendulum, ...circles, mouseOverlay, mouseConstraint, ...fixedConstraints, ...controlCircles, explanationRect, explanationRect2, explanationRect3, testCircle, ...smallRectangles, ...textRectangles, ...walls]);


  // Erstelle einen Runner und starte ihn
  const runner = Runner.create();
  Matter.Runner.run(runner, engine);

  // Starte das Rendering
  Render.run(render);

noLoop();

}
