
///////////////////////////////////////////////////////////////////////////////////

let mydata = {};
let pendulum = [];
let controlCircles = [];
let fixedConstraints = [];


function setup() {
  mydata = loadJSON("nachStundenSortiert.json", drawData);
  noCanvas();
}

function drawData(mydata){
  
}

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

  const testCircle = Matter.Bodies.circle(window.innerWidth / 2, window.innerHeight / 2, 400, {isStatic: true, render: {visible: false, fillStyle: '#ff0000'}}, [24]);
  testCircle.collisionFilter = {'group': -1,'category': 2,'mask': 0,};
  Matter.Body.rotate(testCircle, Math.PI * 1.5);

  const testPath = Matter.Vertices.fromPath("test", testCircle);

  // Erstelle 20 kleinere Rechtecke mit weißer Füllung
  const circles = [];
for(let y = 0; y < 24; y++){
  
  let yPosition = testPath[0].body.vertices[y].y;
  let xPosition = testPath[0].body.vertices[y].x;

/*     if(y >= 12){
      yPosition += 400;
      xPosition %= window.innerWidth;
    }
 */

  const controlCircle = Matter.Bodies.circle(xPosition, yPosition, 10 + mydata[y][1]/50, { isStatic: false, render: { visible: true, fillStyle: 'transparent', text: {content: mydata[y][0], size: 16}}});
  controlCircles.push(controlCircle);

  const fixedConstraint = Matter.Constraint.create({
    bodyA: controlCircles[y],
    pointB: {x: xPosition, y: yPosition},
    stiffness: 0.0001,
    render: {visible: true, strokeStyle: '#ff0000', type: 'line', lineWidth: 1},
  });
  fixedConstraints.push(fixedConstraint);

  for (let i = 0; i < mydata[y][1]/10; i++) {
    let forThisControlCircle = [];
    // colorMap = map(mydata[i][1], 102, 500, 50, 240);
    // circleSizeMap = map(mydata[i][1], 29, 1602, 25, 100);

    // Position zufällig setzen und kleinere Rechtecke erzeugen
    const circleConst = Matter.Bodies.circle(
      random(xPosition - 25, xPosition + 25),  // Zufällige X-Position
      random(yPosition - 25, yPosition + 25), // Zufällige Y-Position
      2,  // Breite des Rechtecks
      { density: 0.0001, isStatic: false, render: { fillStyle: '#ffffff',
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
      stiffness: 0.001,
      lenght: 2,
      render: {visible: false, strokeStyle: '#ffffff', type: 'line', lineWidth: 1},
    });
    pendulum.push(singlependulum);
  }
};


  



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

  // Begrenze die Welt, damit die Rechtecke nicht den Render-Bereich verlassen
  // Erstelle die Kanten (Wände) der Welt
  const wallThickness = 50;
  const walls = [
    Matter.Bodies.rectangle(render.options.width / 2, 0 - wallThickness / 2, render.options.width, wallThickness, { isStatic: true }),  // Oben
    Matter.Bodies.rectangle(render.options.width / 2, render.options.height + wallThickness / 2, render.options.width, wallThickness, { isStatic: true }),  // Unten
    Matter.Bodies.rectangle(0 - wallThickness / 2, render.options.height / 2, wallThickness, render.options.height, { isStatic: true }),  // Links
    Matter.Bodies.rectangle(render.options.width + wallThickness / 2, render.options.height / 2, wallThickness, render.options.height, { isStatic: true })  // Rechts
  ];

  const limitMaxSpeed = (event) => {
    event.source.world.bodies.forEach((body) => {
      let maxSpeed = 80
        Matter.Body.setVelocity(body, {
        x: Math.min(maxSpeed, Math.max(-maxSpeed, body.velocity.x)),
        y: Math.min(maxSpeed, Math.max(-maxSpeed, body.velocity.y)),
      })
    })
  }

  Matter.Events.on(engine, 'beforeUpdate', limitMaxSpeed)

  // Hinzufügen der Objekte zur Welt
  Composite.add(engine.world, [...pendulum, ...circles, mouseConstraint, ...fixedConstraints, ...controlCircles, testCircle, ...walls]);

  // Erstelle einen Runner und starte ihn
  const runner = Runner.create();
  Runner.run(runner, engine);

  // Starte das Rendering
  Render.run(render);

noLoop();
}
