import * as THREE from 'three';
import { ConstNode } from 'three/examples/jsm/nodes/Nodes.js';


var scene, cameraTop, cameraFront, renderer, material;
var topPositiveRotation = false,
  topNegativeRotation = false;
var PositiveCarrinhoMoviment = false,
  NegativeCarrinhoMoviment = false;
var PositiveGarraLift = false,
  NegativeGarraLift = false;
var PositiveGarraOpen = false,
  NegativeGarraOpen = false;
var camera;
var line_crane;
var Dedo_1, Dedo_2, Dedo_3, Dedo_4;
var carrinhoAndCaboGroup;
var Garra;
var SuperiorGroup;
var activeKeys = {};
var collider_carga1, collider_carga2, collider_carga3, collider_carga4, collider_carga5;
var collider_Garra;
var Carga1, Carga2, Carga3, Carga4, Carga5;
var blocoGancho;
var meshes = [];
var mesheColours = [];
var materialstate = true;
var cameraFront, cameraTop, cameraSide, cameraOrth, cameraPers, cameraMove;

function updateHUD() {
  var keysMap = {
    "48": "0",
    "49": "1",
    "50": "2",
    "51": "3",
    "52": "4",
    "53": "5",
    "54": "6",
    "55": "7", // Number keys
    "81": "Q",
    "65": "A",
    "87": "W",
    "83": "S",
    "69": "E",
    "68": "D", // QWERTY keys
    "82": "R",
    "70": "F" // Additional keys
  };

  var hudContent = "Active Keys: ";
  for (var keyCode in keysMap) {
    if (activeKeys[keyCode]) {
      hudContent += "<span class='active-key'>" + keysMap[keyCode] + "</span>";
    } else {
      hudContent += keysMap[keyCode];
    }
  }
  document.getElementById('hud').innerHTML = hudContent;
}

function createBlock(width, height, length, x, y, z, colour) {
  var geometry = new THREE.BoxGeometry(width, height, length);
  material = new THREE.MeshBasicMaterial({
    color: colour,
    wireframe: true
  });
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  scene.add(mesh);
  meshes.push(mesh);
  mesheColours.push(colour);
  const edges = new THREE.EdgesGeometry(geometry);
  const segments = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
    color: 0x000000
  }));
  mesh.add(segments);


  return mesh;
}

function createTetrahedron(width, height, length, x, y, z, colour) {
  var aux = 1
  const verticesOfPyramid = [
    -aux, 0, -aux, // Vertex 0 (bottom-left-back)
    aux, 0, -aux, // Vertex 1 (bottom-right-back)
    aux, 0, aux, // Vertex 2 (bottom-right-front)
    -aux, 0, aux, // Vertex 3 (bottom-left-front)
    0, aux * 2, 0 // Vertex 4 (top)
  ];

  const indicesOfFaces = [
    0, 1, 4, // Face 0 (base)
    1, 2, 4, // Face 1 (right)
    2, 3, 4, // Face 2 (front)
    3, 0, 4, // Face 3 (left)
    0, 3, 2, // Face 4 (back)
  ];

  var geometry = new THREE.PolyhedronGeometry(verticesOfPyramid, indicesOfFaces, 1, 0);

  var material = new THREE.MeshBasicMaterial({
    color: colour,
    side: THREE.DoubleSide,
    wireframe: true
  }); // Red color for example

  // Create a mesh using the geometry and material
  var pyramid = new THREE.Mesh(geometry, material);

  // Optionally, you can set the position, rotation, or scale of the pyramid
  pyramid.position.set(x, y, z);
  pyramid.scale.set(width * 0.7, height, length * 0.7); //solution found to make size work

  // Add the pyramid to the scene
  scene.add(pyramid);
  meshes.push(pyramid);
  mesheColours.push(colour);
  const edging = new THREE.EdgesGeometry(geometry);
  const segmenting = new THREE.LineSegments(edging, new THREE.LineBasicMaterial({
    color: 0x000000
  }));
  pyramid.add(segmenting);

  return pyramid;
}

function createMovingLine(height, length, x, y, z) {
  // Define the geometry for the line
  var geometry = new THREE.BufferGeometry();

  var vertices = [
    0, 0, length, // Start point
    0, -height, 0 // End point
  ];

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

  // Define the material for the line
  material = new THREE.LineBasicMaterial({
    color: 0x003333
  }); // Green color for example

  // Create the line
  line_crane = new THREE.Line(geometry, material);

  // Optionally, set the line's position, rotation, or scale
  line_crane.position.set(x, y, z);

  // Add the line to the scene
  scene.add(line_crane);

  return line_crane;
}

function createLine(height, length, width, x, y, z) {
  // Define the geometry for the line
  var geometry = new THREE.BufferGeometry();
  var vertices = [
    0, 0, -length, // Start point
    width, -height, 0 // End point
  ];
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

  // Define the material for the line
  material = new THREE.LineBasicMaterial({
    color: 0xCC6600
  }); // Green color for example

  // Create the line
  var line = new THREE.Line(geometry, material);

  // Optionally, set the line's position, rotation, or scale
  line.position.set(x, y, z);

  // Add the line to the scene
  scene.add(line);


  return line;
}

function createCameras() {
  var aspectRatio = window.innerWidth / window.innerHeight;

  // Front camera
  var width = 30; // Adjust the width based on your scene requirements
  var height = width / aspectRatio;
  cameraFront = new THREE.OrthographicCamera(
    -width / 2, width / 2, // Left and right bounds
    height / 2, -height / 2, // Top and bottom bounds (inverted to match WebGL coordinate system)
    0.1, 1000 // Near and far clipping planes
  );
  cameraFront.position.set(0, 6, 20); // Adjusted position
  cameraFront.lookAt(0, 6, 0); // Adjusted look-at point

  // Top camera
  width = 30;
  height = width / aspectRatio;
  cameraTop = new THREE.OrthographicCamera(
    -width / 2, width / 2, // Left and right bounds
    height / 2, -height / 2, // Top and bottom bounds (inverted to match WebGL coordinate system)
    0.1, 1000 // Near and far clipping planes
  );
  cameraTop.position.set(0, 30, 3); // Adjusted position
  cameraTop.lookAt(0, 0, 3); // Adjusted look-at point

  // Side camera
  width = 30;
  height = width / aspectRatio;
  cameraSide = new THREE.OrthographicCamera(
    -width / 2, width / 2, // Left and right bounds
    height / 2, -height / 2, // Top and bottom bounds (inverted to match WebGL coordinate system)
    0.1, 1000 // Near and far clipping planes
  );
  cameraSide.position.set(30, 6, 0); // Adjusted position
  cameraSide.lookAt(0, 6, 0); // Adjusted look-at point

  // Orthographic fixed camera
  width = 40;
  height = width / aspectRatio;
  cameraOrth = new THREE.OrthographicCamera(
    -width / 2, width / 2, // Left and right bounds
    height / 2, -height / 2, // Top and bottom bounds (inverted to match WebGL coordinate system)
    0.1, 1000 // Near and far clipping planes
  );
  cameraOrth.position.set(25, 25, 25); // Adjusted position
  cameraOrth.lookAt(0, 5, 0); // Adjusted look-at point

  // Prespective fixed camera
  cameraPers = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  cameraPers.userData = {
    rotate: false,
    step: 0
  }
  cameraPers.position.set(17, 17, 17);
  cameraPers.lookAt(0, 5, 0);

  // Prespective moving camera
  cameraMove = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
  cameraMove.userData = {
    rotate: false,
    step: 0
  }
  cameraMove.position.set(0, 7.5 + 1 + 1.5 - 0.625 - 0.25 / 2 - 2.3 + 0.49, 7.75);
  cameraMove.lookAt(0, 0, 7.75);
  Garra.add(cameraMove);

  camera = cameraSide; // Set default camera

  // Adjust aspect ratio of the default camera
  camera.aspect = aspectRatio;
  camera.updateProjectionMatrix();
}

function render() {
  renderer.render(scene, camera);
}

function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  var aspectRatio = window.innerWidth / window.innerHeight;

  // Update aspect ratio for all cameras
  cameraFront.left = -10 * aspectRatio;
  cameraFront.right = 10 * aspectRatio;
  cameraFront.top = 10;
  cameraFront.bottom = -10;
  cameraFront.updateProjectionMatrix();

  cameraTop.left = -10 * aspectRatio;
  cameraTop.right = 10 * aspectRatio;
  cameraTop.top = 10;
  cameraTop.bottom = -10;
  cameraTop.updateProjectionMatrix();

  cameraSide.left = -10 * aspectRatio;
  cameraSide.right = 10 * aspectRatio;
  cameraSide.top = 10;
  cameraSide.bottom = -10;
  cameraSide.updateProjectionMatrix();

  cameraOrth.left = -12 * aspectRatio;
  cameraOrth.right = 12 * aspectRatio;
  cameraOrth.top = 12;
  cameraOrth.bottom = -12;
  cameraOrth.updateProjectionMatrix();

  cameraPers.aspect = aspectRatio;
  cameraPers.updateProjectionMatrix();

  cameraMove.aspect = aspectRatio;
  cameraMove.updateProjectionMatrix();

  render();
}

function onkeydown(e) {
  switch (e.keyCode) {
    case 49: // 1 key (cameraFront)
      camera = cameraFront;
      break;
    case 50: // 2 key (cameraSide)
      camera = cameraSide;
      break;
    case 51: // 3 key (cameraTop)
      camera = cameraTop;
      break;
    case 52: // 4 key (cameraOrth)
      camera = cameraOrth;
      break;
    case 53: // 5 key (cameraPers)
      camera = cameraPers;
      break;
    case 54: // 6 key (cameraMove)
      camera = cameraMove;
      break;
    case 81: // Q Rotate top
    case 113: // q
      if (lock_movement == false) {
        topNegativeRotation = false;
        topPositiveRotation = !topPositiveRotation;
      }
      break;
    case 65: // A key
    case 97: // a key
      if (lock_movement == false) {
        topPositiveRotation = false;
        topNegativeRotation = !topNegativeRotation;
      }
      break;
    case 87: // W 
    case 119: // w
      if (lock_movement == false) {
        NegativeCarrinhoMoviment = false;
        PositiveCarrinhoMoviment = !PositiveCarrinhoMoviment;
      }
      break;
    case 83: // S key 
    case 115: // s key
      if (lock_movement == false) {
        PositiveCarrinhoMoviment = false;
        NegativeCarrinhoMoviment = !NegativeCarrinhoMoviment;
      }
      break;
    case 69: // E 
    case 101: // e
      if (lock_movement == false) {
        NegativeGarraLift = false;
        PositiveGarraLift = !PositiveGarraLift;
      }
      break;
    case 68: // D key
    case 100: // d key
      if (lock_movement == false) {
        PositiveGarraLift = false;
        NegativeGarraLift = !NegativeGarraLift;
      }
      break;
    case 82: // R
    case 114: // r
      if (lock_movement == false) {
        NegativeGarraOpen = false;
        PositiveGarraOpen = !PositiveGarraOpen;
      }
      break;
    case 70: // F
    case 102: // f
      if (lock_movement == false) {
        PositiveGarraOpen = false;
        NegativeGarraOpen = !NegativeGarraOpen;
      }
      break;

    case 55: //7

      materialstate = !materialstate
      meshes.forEach((mesh, index) => {
        const color = mesheColours[index % mesheColours.length];
        const material = new THREE.MeshBasicMaterial({
          color: color,
          side: THREE.DoubleSide,
          wireframe: materialstate
        });
        mesh.material = material;
      });

      console.log("Material State before toggle:", materialstate);
      break;

    case 48: //0
      back_to_origin = true;
      break;
  }
  var keyCode = event.keyCode.toString();
  activeKeys[keyCode] = true;
  updateHUD();
}

function onkeyup(e) {
  switch (e.keyCode) {
    case 81: // Q
    case 113: // q
      topPositiveRotation = false;
      break;
    case 65: // A
    case 97: // a
      topNegativeRotation = false;
      break;
    case 87: // W
    case 119: // w
      PositiveCarrinhoMoviment = false;
      break;
    case 83: // S
    case 115: // s
      NegativeCarrinhoMoviment = false;
      break;
    case 69: // E
    case 101: // e
      PositiveGarraLift = false;
      break;
    case 68: // D
    case 100: // d
      NegativeGarraLift = false;
      break;
    case 82: // R
    case 114: // r
      PositiveGarraOpen = false;
      break;
    case 70: // F
    case 102: // f
      NegativeGarraOpen = false;
      break;
  }
  var keyCode = event.keyCode.toString();
  activeKeys[keyCode] = false;
  updateHUD();
}

function createScene() {
  scene = new THREE.Scene();

  scene.background = new THREE.Color(0xd0ffff)

  createBlock(3, 1, 3, 0, 0.5, 0, 0xba3f1d); //Base
  createBlock(1, 7.5, 1, 0, 7.5 / 2 + 1 / 2 + 0.5, 0, 0xffd549); //Torre

  SuperiorGroup = new THREE.Group();
  SuperiorGroup.position.set(0, 0, 0); // Set group position

  // Create objects
  var torreCima = createBlock(1, 1.5, 1, 0, 7.5 + 1 / 2 + 1.5 / 2 + 0.5, 0, 0xffd549); // Cima Torre
  var cabine = createBlock(2, 1, 1, 0, 7.5 + 1 + 0.5, 0.5, 0x161032); // Cabine
  var cabineJanela = createBlock(1.9, .5, .5, 0, 7.5 + 1 + 0.5 + 0.05, .8, 0x7EBDC3); // Janela da cabine
  var lanca = createBlock(1, 1, 12, 0, 7.5 + 1 + 1.5 + 0.5, 2.5, 0xffd549); // Lança + contra lança
  var contrapeso = createBlock(1, 0.5, 1.5, 0, 7.5 + 1 + 1.5 - 0.75 + 0.5, -2.25, 0x444444); // Contra-peso
  var carrinho = createBlock(0.5, 0.25, 0.5, 0, 7.5 + 1 + 1.5 - 0.625 + 0.5, 7.75, 0x444444); // Carrinho
  var portaLanca = createTetrahedron(1, 2, 1, 0, 7.5 + 1 + 1.5 + 0.5 + 0.5, 0, 0xffd549); // Porta lança
  var caboAco = createMovingLine(2.25, 0, 0, 7.5 + 1 + 1.5 - 0.625 - 0.25 / 2 + 0.5, 7.75); // Cabo de aço
  var tirante_1 = createLine(2, 5, 0, 0, 7.5 + 1 + 1.5 + 3, 5); // tirante sobre a lança
  var tirante_2 = createLine(2, -2.5, 0.5, 0, 7.5 + 1 + 1.5 + 3, -2.5); // tirante sobre a contralança (direita)
  var tirante_3 = createLine(2, -2.5, -0.5, 0, 7.5 + 1 + 1.5 + 3, -2.5); // tirante sobre a lança (esquerda)

  // Add objects to SuperiorGroup
  SuperiorGroup.add(torreCima, cabine, cabineJanela, lanca, contrapeso, portaLanca, tirante_1, tirante_2, tirante_3);
  // Create a group for carrinho and caboAco
  carrinhoAndCaboGroup = new THREE.Group();
  carrinhoAndCaboGroup.add(carrinho, caboAco);

  /////////////////////////////
  //garra
  var aux = 7.5 + 1 + 1.5 - 0.625 - 0.25 / 2 + 0.5


  blocoGancho = createBlock(0.3, 0.2, 0.3, 0, aux - 2.3, 7.75, 0x000000); //bloco do gancho


  Dedo_1 = new THREE.Group();
  Dedo_1.position.set(0, aux - 2.3 - 0.05, 8); // Set group position

  var parte1, parte2;

  // Calculate positions relative to Dedo_1 group's position
  parte1 = createBlock(0.05, 0.05, 0.1, 0, 0, 0, 0x604801); //parte1 Dedo 1
  parte1.position.set(0, 0, 0); // Set position relative to group
  Dedo_1.add(parte1);

  parte2 = createBlock(0.05, 0.15, 0.05, 0, -0.10, 0, 0x604801); //parte2 Dedo 1
  parte2.position.set(0, -0.10, 0.025); // Set position relative to group
  Dedo_1.add(parte2);

  Dedo_1.scale.set(2, 2, 2);

  /////


  Dedo_2 = new THREE.Group();
  Dedo_2.position.set(0, aux - 2.3 - 0.05, 8 - 0.5); // Set group position

  // Calculate positions relative to Dedo_1 group's position
  parte1 = createBlock(0.05, 0.05, 0.1, 0, 0, 0, 0x604801); //parte1 Dedo 2
  parte1.position.set(0, 0, 0); // Set position relative to group
  Dedo_2.add(parte1);

  parte2 = createBlock(0.05, 0.15, 0.05, 0, -0.10, 0, 0x604801); //parte2 Dedo 2
  parte2.position.set(0, -0.10, -0.025); // Set position relative to group
  Dedo_2.add(parte2);
  Dedo_2.scale.set(2, 2, 2);

  ////

  Dedo_3 = new THREE.Group();
  Dedo_3.position.set(0 + 0.25, aux - 2.3 - 0.05, 7.75); // Set group position

  // Calculate positions relative to Dedo_1 group's position
  parte1 = createBlock(0.1, 0.05, 0.05, 0, 0, 0, 0x604801); //parte1 Dedo 2
  parte1.position.set(0, 0, 0); // Set position relative to group
  Dedo_3.add(parte1);

  parte2 = createBlock(0.05, 0.15, 0.05, 0, -0.10, 0, 0x604801); //parte2 Dedo 2
  parte2.position.set(0.025, -0.1, 0); // Set position relative to group
  Dedo_3.add(parte2);

  Dedo_3.scale.set(2, 2, 2);




  ////

  Dedo_4 = new THREE.Group();
  Dedo_4.position.set(0 - 0.25, aux - 2.3 - 0.05, 7.75); // Set group position

  // Calculate positions relative to Dedo_1 group's position
  parte1 = createBlock(0.1, 0.05, 0.05, 0, 0, 0, 0x604801); //parte1 Dedo 2
  parte1.position.set(0, 0, 0); // Set position relative to group
  Dedo_4.add(parte1);

  parte2 = createBlock(0.05, 0.15, 0.05, 0, -0.10, 0, 0x604801); //parte2 Dedo 2
  parte2.position.set(-0.025, -0.1, 0); // Set position relative to group
  Dedo_4.add(parte2);
  Dedo_4.scale.set(2, 2, 2);


  Garra = new THREE.Group();
  Garra.add(blocoGancho, Dedo_1, Dedo_2, Dedo_3, Dedo_4);

  carrinhoAndCaboGroup.add(Garra);

  SuperiorGroup.add(carrinhoAndCaboGroup);
  scene.add(SuperiorGroup);


  //CONTENTOR

  createBlock(1.2, 0.2, 2.2, 4 + 0.1, 0.1, 6, 0x801616) //base contentor
  createBlock(0.2, 1, 2, 3.6, 0.4 + 0.3, 6.1, 0x801616) //parede 1
  createBlock(0.2, 1, 2, 4.6, 0.4 + 0.3, 5.9, 0x801616) //parede 2
  createBlock(1, 1, 0.2, 4, 0.4 + 0.3, 5, 0x801616) //parede 3
  createBlock(1, 1, 0.2, 4.2, 0.4 + 0.3, 7, 0x801616) //parede 4

  //CARGA
  var carga1, carga2, carga3, carga4, carga5;

  carga1 = createBlock(0.25, 0.25, 0.25, 0, 0, 0, 0x00FF00);

  var geometry = new THREE.DodecahedronGeometry(0.15);
  material = new THREE.MeshBasicMaterial({
    color: 0xFF3333,
    wireframe: true
  });
  var carga2 = new THREE.Mesh(geometry, material);
  var edging = new THREE.EdgesGeometry(geometry);
  var segmenting = new THREE.LineSegments(edging, new THREE.LineBasicMaterial({
    color: 0x000000
  }));
  carga2.add(segmenting);
  meshes.push(carga2);
  mesheColours.push(0xFF3333);


  var geometry = new THREE.IcosahedronGeometry(0.15);
  material = new THREE.MeshBasicMaterial({
    color: 0xFF0000,
    wireframe: true
  });
  var carga3 = new THREE.Mesh(geometry, material);
  var edging = new THREE.EdgesGeometry(geometry);
  var segmenting = new THREE.LineSegments(edging, new THREE.LineBasicMaterial({
    color: 0x000000
  }));
  carga3.add(segmenting);
  meshes.push(carga3);
  mesheColours.push(0xfff000);


  var geometry = new THREE.TorusGeometry(0.15, 0.075, 30, 30);
  material = new THREE.MeshBasicMaterial({
    color: 0xFF33FF,
    wireframe: true
  });
  var carga4 = new THREE.Mesh(geometry, material);
  var edging = new THREE.EdgesGeometry(geometry);
  var segmenting = new THREE.LineSegments(edging, new THREE.LineBasicMaterial({
    color: 0x000000
  }));
  carga4.add(segmenting);
  meshes.push(carga4);
  mesheColours.push(0xFF33FF);


  var geometry = new THREE.TorusKnotGeometry(0.30, 0.12, 32, 30, 2, 3);
  material = new THREE.MeshBasicMaterial({
    color: 0x00FFFF,
    wireframe: true
  });
  var carga5 = new THREE.Mesh(geometry, material);
  var edging = new THREE.EdgesGeometry(geometry);
  var segmenting = new THREE.LineSegments(edging, new THREE.LineBasicMaterial({
    color: 0x000000
  }));
  carga5.add(segmenting);
  meshes.push(carga5);
  mesheColours.push(0x00FFFF);


  //COLISAO

  var rnd_position;

  var sphere = new THREE.SphereGeometry(0.2)
  var sphereMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0
  }) //{ color: 0xffffff, wireframe: true });


  collider_Garra = new THREE.Mesh(sphere, sphereMaterial);
  collider_Garra.garraRadius = 0.15;
  collider_Garra.position.copy(blocoGancho.position);
  scene.add(collider_Garra)
  Garra.add(collider_Garra);

  collider_carga1 = new THREE.Mesh(sphere, sphereMaterial);
  collider_carga1.radius = 0.2;
  collider_carga1.position.copy(carga1.position);
  Carga1 = new THREE.Group();
  rnd_position = getRandomPosition()
  Carga1.position.set(rnd_position.x, 0.125, rnd_position.z)
  Carga1.add(carga1, collider_carga1);
  scene.add(Carga1)

  console.log(rnd_position);

  collider_carga2 = new THREE.Mesh(sphere, sphereMaterial);
  collider_carga2.radius = 0.2;
  collider_carga2.position.copy(carga2.position);
  Carga2 = new THREE.Group();
  rnd_position = getRandomPosition()
  Carga2.position.set(rnd_position.x, 0.135, rnd_position.z)
  Carga2.add(carga2, collider_carga2);
  scene.add(Carga2)

  console.log(rnd_position);

  collider_carga3 = new THREE.Mesh(sphere, sphereMaterial);
  collider_carga3.radius = 0.2;
  collider_carga3.position.copy(carga3.position);
  Carga3 = new THREE.Group();
  rnd_position = getRandomPosition()
  Carga3.position.set(rnd_position.x, 0.135, rnd_position.z)
  Carga3.add(carga3, collider_carga3);
  scene.add(Carga3)

  console.log(rnd_position);

  var sphere = new THREE.SphereGeometry(0.3)


  collider_carga4 = new THREE.Mesh(sphere, sphereMaterial);
  collider_carga4.radius = 0.3;
  collider_carga4.position.copy(carga4.position);
  Carga4 = new THREE.Group();
  rnd_position = getRandomPosition()
  Carga4.position.set(rnd_position.x, 0.25, rnd_position.z)
  Carga4.add(carga4, collider_carga4);
  scene.add(Carga4)

  console.log(rnd_position);

  var sphere = new THREE.SphereGeometry(0.6)


  collider_carga5 = new THREE.Mesh(sphere, sphereMaterial);
  collider_carga5.radius = 0.6;
  collider_carga5.position.copy(carga5.position);
  Carga5 = new THREE.Group();
  rnd_position = getRandomPosition()
  Carga5.position.set(rnd_position.x, 0.53, rnd_position.z)
  Carga5.add(carga5, collider_carga5);
  scene.add(Carga5)

  console.log(rnd_position);



  scene.add(new THREE.AxesHelper(10));
}

var generatedPositions = [];

function getRandomPosition() {
  // Generate random x and z coordinates within bounds
  var x = (Math.random() * 10) - 5; // Range: -5 to 5 carga needs to be reachable
  var z = (Math.random() * 10) - 5; // Range: -5 to 5

  for (var pos of generatedPositions) {
    if (pos.x === x && pos.z === z) {
      return getRandomPosition();
    }
  }

  //base contentor centro-> (4 + 0.1,0.1,6)   size -> (1.2, 0.2, 2.2)
  if (x < 4.1 + 1.2 / 2.0 + 0.5 && x > 4.1 - 1.2 / 2.0 - 0.5 && z < 6 + 2.2 / 2.0 + 0.5 && z > 6 - 2.2 / 2.0 - 0.5) {
    return getRandomPosition();
  }

  //base grua centro->(0, 0.5, 0)  size->(3, 1 , 3)
  if (x < 0 + 3 / 2.0 + 1 && x > 0 - 3 / 2.0 - 1 && z < 0 + 3 / 2.0 + 1 && z > 0 - 3 / 2.0 - 1) {
    return getRandomPosition();
  }


  //console.log([x, z])

  //all must have more 0.5 from each base to not me to close when created

  //TODO check for limit base and contetor
  generatedPositions.push([x, z])
  return {
    x,
    z
  };
}

// Função para verificar colisão entre duas esferas
function checkCollision() {
  var distances = [
    collider_Garra.getWorldPosition(new THREE.Vector3()).distanceToSquared(collider_carga1.getWorldPosition(new THREE.Vector3())),
    collider_Garra.getWorldPosition(new THREE.Vector3()).distanceToSquared(collider_carga2.getWorldPosition(new THREE.Vector3())),
    collider_Garra.getWorldPosition(new THREE.Vector3()).distanceToSquared(collider_carga3.getWorldPosition(new THREE.Vector3())),
    collider_Garra.getWorldPosition(new THREE.Vector3()).distanceToSquared(collider_carga4.getWorldPosition(new THREE.Vector3())),
    collider_Garra.getWorldPosition(new THREE.Vector3()).distanceToSquared(collider_carga5.getWorldPosition(new THREE.Vector3()))
  ];

  var minDistanceSquaredIndex = distances.indexOf(Math.min(...distances)); // Index of the closest cargo

  var minDistanceSquared = distances[minDistanceSquaredIndex];
  var collider_cargo;

  switch (minDistanceSquaredIndex) {
    case 0:
      collider_cargo = Carga1;
      break;
    case 1:
      collider_cargo = Carga2;
      break;
    case 2:
      collider_cargo = Carga3;
      break;
    case 3:
      collider_cargo = Carga4;
      break;
    case 4:
      collider_cargo = Carga5;
      break;
    default:
      break;
  }

  var radius;
  switch (minDistanceSquaredIndex) {
    case 0:
      radius = collider_carga1.radius;
      break;
    case 1:
      radius = collider_carga2.radius;
      break;
    case 2:
      radius = collider_carga3.radius;
      break;
    case 3:
      radius = collider_carga4.radius;
      break;
    case 4:
      radius = collider_carga5.radius;
      break;
    default:
      break;
  }

  var minDistanceSquaredWithRadius = (collider_Garra.garraRadius + radius) * (collider_Garra.garraRadius + radius);


  if (minDistanceSquared < minDistanceSquaredWithRadius) {
    collided_cargo = collider_cargo;
    place_cargo = true;
    return true;
  }



  /*     if (distance_cargo_1 < minDistanceSquared) {
          collided_cargo = Carga1;
          place_cargo = true;
          return true;

      }
      if (distance_cargo_2 < minDistanceSquared) {
          collided_cargo = Carga2;
          place_cargo = true;
          return true;
      }
      if (distance_cargo_3 < minDistanceSquared) {
          collided_cargo = Carga3;
          place_cargo = true;
          return true;
      }
      if (distance_cargo_4 < minDistanceSquared) {
          collided_cargo = Carga4;
          place_cargo = true;
          return true;
      }
      if (distance_cargo_5 < minDistanceSquared) {
          collided_cargo = Carga5;
          place_cargo = true;
          return true;
      } */
  return false;
}

function init() {

  // Renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //Scene
  createScene();
  // Cameras
  createCameras();
  updateHUD();

  window.addEventListener("resize", onResize);
  window.addEventListener("keydown", onkeydown);
  window.addEventListener("keyup", onkeyup);
}

var Test_moviment = false;


var close_claw = false;
var moveCargo = false;
var place_cargo = false;
var go_back = false;

var lift_cargo = false,
  rotate_cargo = false,
  move_car = false,
  lower_claw = false;

var release_cargo = false;
var back_to_origin = false,
  continue_way_back = false;

var collided_cargo

var lock_movement = false;

var cargo_aux = 0;

let previousTime = performance.now(); // Variable to store the previous timestamp

var Knot_torus_diff = 0;

function animate() {

  const currentTime = performance.now(); // Get the current timestamp
  const deltaTime = (currentTime - previousTime) / 10; // Calculate the time difference since the last frame, in seconds
  previousTime = currentTime; // Update previous time

  if (topPositiveRotation) {
    SuperiorGroup.rotation.y += 0.005 * deltaTime; // Scale rotation by deltaTime
  }
  if (topNegativeRotation) {
    SuperiorGroup.rotation.y -= 0.005 * deltaTime; // Scale rotation by deltaTime
  }
  if (PositiveCarrinhoMoviment) {
    if (carrinhoAndCaboGroup.position.z < 0.2) {
      carrinhoAndCaboGroup.position.z += 0.02 * deltaTime; // Scale position change by deltaTime
    }
  }
  if (NegativeCarrinhoMoviment) {
    if (carrinhoAndCaboGroup.position.z > -5.8) {
      carrinhoAndCaboGroup.position.z -= 0.02 * deltaTime; // Scale position change by deltaTime
    }
  }
  if (PositiveGarraLift) {
    if (Garra.position.y < 2) {
      Garra.position.y += 0.01 * deltaTime; // Scale position change by deltaTime
      line_crane.geometry.attributes.position.setXYZ(1, 0, Garra.position.y - 2.25, 0);
      line_crane.geometry.attributes.position.needsUpdate = true;
    }
  }
  if (NegativeGarraLift) {
    if (Garra.position.y > -7.1) {
      Garra.position.y -= 0.01 * deltaTime; // Scale position change by deltaTime
      line_crane.geometry.attributes.position.setXYZ(1, 0, Garra.position.y - 2.25, 0);
      line_crane.geometry.attributes.position.needsUpdate = true;
    }
  }
  if (PositiveGarraOpen) {
    if (Dedo_1.rotation.x < 0.51) {
      Dedo_1.rotation.x += 0.01 * deltaTime; // Scale rotation by deltaTime
      Dedo_1.position.y -= 0.001 * deltaTime; // Scale position change by deltaTime
    }
    if (Dedo_2.rotation.x > -0.51) {
      Dedo_2.rotation.x -= 0.01 * deltaTime; // Scale rotation by deltaTime
      Dedo_2.position.y -= 0.001 * deltaTime; // Scale position change by deltaTime
    }
    if (Dedo_3.rotation.z > -0.51) {
      Dedo_3.rotation.z -= 0.01 * deltaTime; // Scale rotation by deltaTime
      Dedo_3.position.y -= 0.001 * deltaTime; // Scale position change by deltaTime
    }
    if (Dedo_4.rotation.z < 0.51) {
      Dedo_4.rotation.z += 0.01 * deltaTime; // Scale rotation by deltaTime
      Dedo_4.position.y -= 0.001 * deltaTime; // Scale position change by deltaTime
    }
  }
  if (NegativeGarraOpen) {
    if (Dedo_1.rotation.x > -0.51) {
      Dedo_1.rotation.x -= 0.01 * deltaTime; // Scale rotation by deltaTime
      Dedo_1.position.y += 0.001 * deltaTime; // Scale position change by deltaTime
    }
    if (Dedo_2.rotation.x < 0.51) {
      Dedo_2.rotation.x += 0.01 * deltaTime; // Scale rotation by deltaTime
      Dedo_2.position.y += 0.001 * deltaTime; // Scale position change by deltaTime
    }
    if (Dedo_3.rotation.z < 0.51) {
      Dedo_3.rotation.z += 0.01 * deltaTime; // Scale rotation by deltaTime
      Dedo_3.position.y += 0.001 * deltaTime; // Scale position change by deltaTime
    }
    if (Dedo_4.rotation.z > -0.51) {
      Dedo_4.rotation.z -= 0.01 * deltaTime; // Scale rotation by deltaTime
      Dedo_4.position.y += 0.001 * deltaTime; // Scale position change by deltaTime
    }
  }

  if (back_to_origin) {

    if (Garra.position.y < -5) {
      PositiveGarraLift = true
    } else {
      continue_way_back = true
      PositiveGarraLift = false
    }

    if (continue_way_back) {
      if (Garra.position.y < 0) {
        PositiveGarraLift = true
      } else {
        PositiveGarraLift = false
      }
      if (SuperiorGroup.rotation.y > 0) {
        topNegativeRotation = true
      } else {
        topNegativeRotation = false
      }

      if (carrinhoAndCaboGroup.position.z < 0) {
        PositiveCarrinhoMoviment = true
      } else {
        PositiveCarrinhoMoviment = false
      }
    }

    if (continue_way_back == true && PositiveGarraLift == false && topNegativeRotation == false && PositiveCarrinhoMoviment == false) {
      continue_way_back = false;
      NegativeGarraOpen = false;
      back_to_origin = false;
      lock_movement = false;
    }


  }

  if (moveCargo) {
    collided_cargo.position.copy(collider_Garra.getWorldPosition(new THREE.Vector3()));
    if (collided_cargo.children[1] == collider_carga5) {
      cargo_aux = 0.5;
      Knot_torus_diff = 0.8;
    }
    collided_cargo.remove(collided_cargo.children[1]);

    collided_cargo.position.y -= (0.22 + cargo_aux);

  }

  if (release_cargo) {
    moveCargo = false;
    cargo_aux = 0;
    //place_cargo = false;
    if (Dedo_1.rotation.x < 0) {
      back_to_origin = true;
      release_cargo = false;
    }

  }

  //console.log(SuperiorGroup.rotation.y);
  //console.log(carrinhoAndCaboGroup.position.z);
  //console.log(Garra.position.y);



  if (checkCollision()) {
    lock_movement = true;
    topPositiveRotation = false;
    NegativeCarrinhoMoviment = false;
    NegativeGarraLift = false;
    Test_moviment = false;
    moveCargo = true;
    place_cargo = true;
    close_claw = true;

  }

  if (place_cargo) {

    if (close_claw) {
      PositiveGarraOpen = true;
      if (Dedo_1.rotation.x > 0.51) {
        lift_cargo = true;
        close_claw = false;
      }

    }

    if (lift_cargo) {
      if (Garra.position.y < -4) {
        PositiveGarraLift = true;
      } else {
        PositiveGarraLift = false;
        lift_cargo = false;
        rotate_cargo = true;
      }

    }

    if (rotate_cargo) {
      if (SuperiorGroup.rotation.y > 0.585) {
        go_back = true;
        topNegativeRotation = true;
      } else {
        topNegativeRotation = false;
        if (go_back) {
          rotate_cargo = false;
          move_car = true;
        }
      }
    }

    if (go_back == false) {
      if (rotate_cargo) {
        if (SuperiorGroup.rotation.y < 0.57) {
          topPositiveRotation = true;
        } else {
          topPositiveRotation = false;
          rotate_cargo = false;
          move_car = true;
        }
      }
    }

    if (move_car) {
      go_back = false;
      if (carrinhoAndCaboGroup.position.z < -0.4) {
        PositiveCarrinhoMoviment = true
      } else {
        PositiveCarrinhoMoviment = false
        move_car = false;
        lower_claw = true;
      }
    }

    if (lower_claw) {
      if (Garra.position.y > -6.8 + Knot_torus_diff) {
        NegativeGarraLift = true;
      } else {
        Knot_torus_diff = 0;
        NegativeGarraLift = false;
        lower_claw = false;
        PositiveGarraOpen = false;
        NegativeGarraOpen = true;
        release_cargo = true;
        place_cargo = false;
      }
    }

  }

  render();
  requestAnimationFrame(animate);
}

init();
animate();
