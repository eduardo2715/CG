import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.125.2/build/three.module.js';

var scene, cameraTop, cameraFront, renderer, cylinder;
        var switchCamera = false;
        var camera
        var all_objects;
        var level_1, level_2, level_3;
        var level_1_lights, level_2_lights, level_3_lights;
        var mobius_lights;
        var directionalLight
        var objects = [];
        var lightingEnabled = true;

        var materials = {
            Lambert: new THREE.MeshLambertMaterial({ color: 0xff0000, side: THREE.DoubleSide }),
            Phong: new THREE.MeshPhongMaterial({ color: 0xff0000, side: THREE.DoubleSide }),
            Toon: new THREE.MeshToonMaterial({ color: 0xff0000, side: THREE.DoubleSide }),
            Normal: new THREE.MeshNormalMaterial({ color: 0xff0000, side: THREE.DoubleSide }),
            Basic: new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide }) // Add Basic material for no lighting
        };

        // Function to switch material and shading type
        function switchMaterial(material) {
            objects.forEach(function (obj) {
                obj.material = materials[material];
            });
            console.log(material)
        }
        // Function to switch shading type
        function switchShading(shading) {

            if (shading == "gouraud"){
                objects.forEach(function (obj) {
                    obj.geometry.computeVertexNormals();
                });
            }else if (shading == "phong"){

            }else if (shading == "cartoon"){
                
            }else if (shading == "normal"){
                
            }
            console.log(shading)

        }

        function toggleLighting() {
            lightingEnabled = !lightingEnabled;
            if (lightingEnabled) {
                switchMaterial('Lambert'); // Default to Lambert when lighting is enabled
            } else {
                switchMaterial('Basic'); // Switch to Basic material when lighting is disabled
            }
        }

        function createOneSheetHyperboloid(){
            // Define the hyperboloid function
            function hyperboloid(u, v, target) {
                const a = 0.25; // Size parameter
                const b = 0.25; // Size parameter
                const c = 0.25; // Size parameter
                const theta = 2 * Math.PI * u;
                const phi = Math.PI * v - Math.PI / 2;
                const x1 = a * Math.cosh(phi) * Math.cos(theta);
                const y1 = b * Math.cosh(phi) * Math.sin(theta);
                const z1 = c * Math.sinh(phi);
                target.set(x1, y1, z1);
            }

            // Create the hyperboloid geometry
            const geometry = new THREE.ParametricGeometry(hyperboloid, 20, 20);

            // Create the material
            const material = new THREE.MeshStandardMaterial({ color: 0xff0000 , side: THREE.DoubleSide });

            // Create the mesh
            const oneSheetHyperboloid = new THREE.Mesh(geometry, material);

            return oneSheetHyperboloid;
        }

        function createLissajousSurface() {
            var geometry = new THREE.ParametricGeometry(function(u, v, target) {
                const a = 5; // Amplitude in x
                const b = 5; // Amplitude in y
                const c = 5; // Amplitude in z
                const A = 1; // Frequency in x
                const B = 2; // Frequency in y
                const C = 3; // Frequency in z
                const delta = Math.PI / 2; // Phase shift

                u *= 2 * Math.PI; // U parameter goes from 0 to 2pi
                v *= 2 * Math.PI; // V parameter goes from 0 to 2pi

                const x = a * Math.sin(A * u + delta);
                const y = b * Math.sin(B * v);
                const z = c * Math.sin(C * (u + v));

                target.set(x, y, z).multiplyScalar(0.12);
            }, 64, 64);

  
            const material = new THREE.MeshStandardMaterial({ color: 0xff0000 , side: THREE.DoubleSide });
            var mesh = new THREE.Mesh(geometry, material);

            return mesh; // Return mesh for further manipulation if needed
        }


        function createTorusParametricGeometry() {
            // Define parametric function
            const parametricFunction = function (u, v, vector) {
                u *= Math.PI * 2;
                v *= Math.PI * 2;

                const x = Math.cos(u) * (2 + Math.cos(v));
                const y = Math.sin(u) * (2 + Math.cos(v));
                const z = Math.sin(v);

                vector.set(x/4, y/4, z/4);
            };

            // Create parametric geometry
            const geometry = new THREE.ParametricGeometry(parametricFunction, 64, 64);

            // Create a material
            const material = new THREE.MeshStandardMaterial({ color: 0xff0000});

            const mesh = new THREE.Mesh(geometry, material);

            // Create a mesh and return it
            return mesh;
        }

        function createHalfSphearGeometry() {
            var geometry = new THREE.ParametricGeometry(function(u, v, vector) {
                var x = Math.sin(u * Math.PI) * Math.cos(v * Math.PI);
                var y = Math.sin(u * Math.PI) * Math.sin(v * Math.PI);
                var z = Math.cos(u * Math.PI);
                vector.set(x, y, z).multiplyScalar(0.75);
            }, 20, 20);

            var material = new THREE.MeshStandardMaterial({ color: 0xff0000 , side: THREE.DoubleSide});
            var mesh = new THREE.Mesh(geometry, material);

            return mesh; // Return mesh for further manipulation if needed
        }

        function createTwistedRibbonGeometry() {
            // Define parametric geometry function for twisted ribbon
            function twistedRibbon(u, v, target) {
                u = u * Math.PI * 2; // Parameter u is mapped to angle in radians
                v = (v - 0.5) * 2; // Map v from range [0, 1] to [-1, 1]

                // Define ribbon's parametric equations
                const x = Math.sin(u);
                const y = Math.sin(v);
                const z = Math.cos(u + v);

                // Set the result vector
                target.set(x, y, z).multiplyScalar(0.75);
            }

            // Create parametric geometry using the twistedRibbon function
            const geometry = new THREE.ParametricGeometry(twistedRibbon, 50, 50);

            const material = new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide});

            const mesh = new THREE.Mesh(geometry, material);
            // Return the created geometry

            return mesh;

            
        }

        function createComplexParametricObject() {

            function customParametric(u, v, vector) {
                const r = 1 + 0.5 * Math.sin(6 * Math.PI * v);
                const x = r * Math.cos(2 * Math.PI * u) * Math.sin(Math.PI * v);
                const y = r * Math.sin(2 * Math.PI * u) * Math.sin(Math.PI * v);
                const z = r * Math.cos(Math.PI * v);
                return vector.set(x, y, z).multiplyScalar(0.75);
            }
            // Create parametric geometry
            const parametricGeometry = new THREE.ParametricGeometry(customParametric, 25, 25);

            // Material and mesh
            const material = new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide});
            const mesh = new THREE.Mesh(parametricGeometry, material);

            return mesh;
            }

        function createComplexParametricObject_2() {
            // Define the custom parametric function for a twisted shell-like surface with a spiral pattern
            function customParametric(u, v, vector) {
                const radius = 1; // Radius of the shell
                const twist = 4; // Number of twists
                const angle = u * Math.PI * 2 * twist;
                const spiralFactor = 0.5; // Factor for the spiral pattern
                const spiralHeight = v * spiralFactor; // Height of the spiral pattern
                const x = (radius + spiralHeight * Math.cos(angle)) * Math.cos(v * Math.PI);
                const y = (radius + spiralHeight * Math.cos(angle)) * Math.sin(v * Math.PI);
                const z = spiralHeight * Math.sin(angle);
                return vector.set(x, y, z);
            }

            

            // Create parametric geometry
            const parametricGeometry = new THREE.ParametricGeometry(customParametric, 50, 50);

            // Material and mesh
            const material = new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide });
            const mesh = new THREE.Mesh(parametricGeometry, material);


            return mesh

        }

        function createParametricSurface_1() {
            // Define the custom parametric function for a twisted saddle surface
            function customParametric(u, v, vector) {
                const x = u - 0.5; // Centering the saddle surface
                const y = (Math.sin(u * Math.PI * 2) * Math.sin(v * Math.PI * 2)) * 0.5; // Warping along the y-axis
                const z = v - 0.5; // Centering the saddle surface
                return vector.set(x, y, z).multiplyScalar(1.5);
            }

            // Create parametric geometry
            const parametricGeometry = new THREE.ParametricGeometry(customParametric, 25, 25);

            // Material and mesh
            const material = new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide });
            const mesh = new THREE.Mesh(parametricGeometry, material);
            scene.add(mesh);

            return mesh;

        }

        function createMobiusStrip() {
            // Initialize a fixed point
            var p = new THREE.Vector3(0, 0, 0);
        
            function mobius(u, t, target) {
                u = u - 0.5;
                const v = t * 2 * Math.PI;
        
                const x = Math.cos(v) * (1 + u * 0.5 * Math.cos(v / 2));
                const y = Math.sin(v) * (1 + u * 0.5 * Math.cos(v / 2));
                const z = 0.5 * u * Math.sin(v / 2);
        
                target.set(x * 2, y * 2, z * 2);
            }
        
            // Create the geometry using ParametricBufferGeometry
            const geometry = new THREE.ParametricBufferGeometry(mobius, 100, 20);
        
            // Create a material
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
        
            // Create the mesh
            const mobiusStrip = new THREE.Mesh(geometry, material);
            mobiusStrip.rotation.x += Math.PI / 2;
            mobiusStrip.position.y = 1;
            objects.push(mobiusStrip); // Assuming objects is an array to hold your meshes
        



            for(let i = 0; i<=1; i+=0.125){
                const u = 0 + i; // Adjust as needed within the range [0, 1]
                const t = 0.2 + i; // Adjust as needed within the range [0, 1]
                const pointOnMobius = new THREE.Vector3();
                mobius(u, t, pointOnMobius);

                const light = new THREE.PointLight(0xffffff, 0.5, 3);
                light.position.set(pointOnMobius.x, pointOnMobius.y, pointOnMobius.z)
                mobius_lights.add(light);

                console.log("Point on Mobius strip:", pointOnMobius);
            }

            mobius_lights.rotation.x += Math.PI / 2;
            mobius_lights.position.y = 1;

           


            return mobiusStrip;
        }
        

        function createCylinder(radius, height){
            // Cylinder
            var shape = new THREE.Shape();
            shape.moveTo(1, 0);
            shape.absarc(0, 0, radius, 0, Math.PI * 2, false);

            var extrudeSettings = {
                steps: 1,
                depth: height,
                bevelEnabled: false,
                curveSegments: 64
            };

            var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            cylinder = new THREE.Mesh(geometry, material);
            cylinder.rotation.x = Math.PI / 2; // Rotate cylinder to align along y-axis
            objects.push(cylinder);

            return cylinder;
        }

        function createRing(intRadius, extRadius, height, extrudeHeight) {
            var shape = new THREE.Shape();
            shape.absarc(0, 0, extRadius, 0, Math.PI * 2, false);

            var hole = new THREE.Path();
            hole.absarc(0, 0, intRadius, 0, Math.PI * 2, true);
            shape.holes.push(hole);

            var extrudeSettings = {
                steps: 1,
                depth: extrudeHeight,
                bevelEnabled: false,
                curveSegments: 64
            };

            var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            geometry.rotateX(Math.PI / 2); // Rotate to align with y-axis

            geometry.translate(0, height, 0); // Move down to align bottom at y = 0

            var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            var ring = new THREE.Mesh(geometry, material);

            objects.push(ring);

            return ring;
        }

        function createSpotlightsForCubes(cubePositions, level_lights) {
            cubePositions.forEach(function(pos, index) {
                /* if (index == 1 || index == 3 || index == 5 || index == 7 || index == 2 || index == 4 || index == 6){  // only create one spotlight per ring
                    return;
                } */
                var spotLight;

                spotLight = new THREE.SpotLight( 0xffffff, 2);
				spotLight.position.set( pos.x, pos.y + 0.5, pos.z);
                spotLight.target.position.set( pos.x, pos.y + 1, pos.z);
				spotLight.angle = Math.PI/3;
				spotLight.penumbra = 1;
				spotLight.decay = 1;
				spotLight.distance = 3;

				spotLight.castShadow = false;
				spotLight.shadow.mapSize.width = 1024;
				spotLight.shadow.mapSize.height = 1024;
				spotLight.shadow.camera.near = 1;
				spotLight.shadow.camera.far = 10;
				spotLight.shadow.focus = 1;

                // Create a spotlight helper for debugging
                var spotLightHelper = new THREE.SpotLightHelper(spotLight);

                // Add spotlight, its target, and helper to the scene
                level_lights.add(spotLight);
                level_lights.add(spotLight.target);
                level_lights.add(spotLightHelper);
            });
        }

        function createRingFigures(radius, height, level, level_lights) {
            var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
            var cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

            var angleIncrement = Math.PI / 4; // 45 degrees in radians
            var cubePositions = [];
            for (var i = 0; i < 8; i++) {
                var angle = i * angleIncrement;
                var x = radius * Math.cos(angle);
                var z = radius * Math.sin(angle);
                cubePositions.push(new THREE.Vector3(x, height + 1.5, z)); // Store cube positions as THREE.Vector3
            }

            function shuffle(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }

            var shuffledPositions = shuffle(cubePositions);
            

            shuffledPositions.forEach(function(pos, index) {
                var obj;
                   if (index == 0) {  // Every third position
                    obj = createHalfSphearGeometry();
                } else if (index == 1) {  // Every third position after the first
                    obj = createOneSheetHyperboloid();
                }else if (index == 2) {  // Every third position after the second
                    obj = createTorusParametricGeometry();
                }else if (index == 3) {
                    obj = createTwistedRibbonGeometry();
                }else if (index == 4){  // Default to cube for other positions
                    obj = createComplexParametricObject();
                }else if (index == 5){  // Default to cube for other positions
                    obj = createComplexParametricObject_2();
                }else if (index == 6) {
                    obj = createParametricSurface_1();
                }else if (index == 7){
                    obj = createLissajousSurface();
                }    
                else {  // Default to cube for other positions
                     obj = new THREE.Mesh(cubeGeometry, cubeMaterial);
                  }
                obj.position.copy(pos);
                level.add(obj);
                objects.push(obj);
            });

            // Create spotlights for each cube
            createSpotlightsForCubes(cubePositions, level_lights);
        }

        function createCameras(){
             cameraTop = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            cameraTop.position.set(0, 20, 0);
            cameraTop.lookAt(0, 0, 0);

/*             var aspectRatio = window.innerWidth / window.innerHeight;
            var width = 100; // Adjust as needed based on your scene size
            var height = width / aspectRatio;
            cameraTop = new THREE.OrthographicCamera(
                width / -2,   // Left
                width / 2,    // Right
                height / 2,   // Top
                height / -2,  // Bottom
                0.1,          // Near plane
                1000          // Far plane
            );
            cameraTop.position.set(0, 100, 0);
            cameraTop.lookAt(scene.position); */

            /* cameraFront = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            cameraFront.position.set(20, -9, 20);
            cameraFront.lookAt(0, 0, 0); */
            
            var aspectRatio = window.innerWidth / window.innerHeight;
            var width = 45; // Adjust as needed based on your scene size
            var height = width / aspectRatio;
            cameraFront = new THREE.OrthographicCamera(
                width / -2,   // Left
                width / 2,    // Right
                height / 2,   // Top
                height / -2,  // Bottom
                0.1,          // Near plane
                1000          // Far plane
            );
            cameraFront.position.set(15, -9, -15); 
            cameraFront.lookAt(0, -9 ,0);
        }

        function render(){
            renderer.render(scene, camera);
        }

        // function onResize() {

        //     renderer.setSize(window.innerWidth, window.innerHeight);

        //     if (window.innerHeight > 0 && window.innerWidth > 0) {
        //         camera.aspect = window.innerWidth / window.innerHeight;
        //         camera.updateProjectionMatrix();
        //     }

        // }

        function toggleSpotlightHelpersVisibility(visibility) {
            level_1_lights.children.forEach(function (child) {
                if (child instanceof THREE.SpotLightHelper) {
                    child.visible = visibility;
                }
            });
            level_2_lights.children.forEach(function (child) {
                if (child instanceof THREE.SpotLightHelper) {
                    child.visible = visibility;
                }
            });
            level_3_lights.children.forEach(function (child) {
                if (child instanceof THREE.SpotLightHelper) {
                    child.visible = visibility;
                }
            });
        }

        function toggleSpotlights() {
            level_1_lights.visible = !level_1_lights.visible;
            level_2_lights.visible = !level_2_lights.visible;
            level_3_lights.visible = !level_3_lights.visible;
        }

        function togglePointlights(){
            mobius_lights.visible = !mobius_lights.visible;
        }

        function toggleDirectionalLight(){
            directionalLight.visible = !directionalLight.visible;
        }

        function onkeydown(e){

            switch(e.keyCode){

                case 49: // 1
                move_ring_1 = true;
                break;
                case 50: // 2
                move_ring_2 = true;
                break;
                case 51: // 3
                move_ring_3 = true;
                break;

                case 52: //4
                    switchCamera = !switchCamera;
                    break;
              
                case 83: // S key
                case 115: // s key
                    toggleSpotlights();
                    break;
                case 80: // P key
                case 112: // p key
                    togglePointlights();
                    break;
                case 68: // D key
                case 100: // d key
                    toggleDirectionalLight();
                    break;

                case 81: // Q
                case 113: // q
                    switchMaterial('Lambert');
                    switchShading('gouraud'); // Gouraud (diffuse) shading
                    break;
                case 87: // W
                case 119: // w
                    switchMaterial('Phong');
                    switchShading('phong'); // Phong shading
                    break;
                case 69: // E
                case 101: // e
                    switchMaterial('Toon');
                    switchShading('cartoon'); // Cartoon shading
                    break;
                case 82: // R
                case 114: // r
                    switchMaterial('Normal');
                    switchShading('normal'); // NormalMap shading
                    break;
                case 84: // T key
                case 116: // t key
                    toggleLighting();
                    break;
                
                case 65: //A
                case 97: //a
                    scene.traverse(function (node){
                        if(node instanceof THREE.Mesh){
                            node.material.wireframe = !node.material.wireframe;
                        }
                    });
                break;

                case 75: // K key
                case 107: // k key
                    toggleSpotlightHelpersVisibility(false);
                    break;
                case 76: // L key
                case 108: // l key
                    toggleSpotlightHelpersVisibility(true);
                    break;
            }
        }

        function onkeyup(e) {
            switch (e.keyCode) {
                case 49: // 1
                move_ring_1 = false;
                break;
                case 50: // 2
                move_ring_2 = false;
                break;
                case 51: // 3
                move_ring_3 = false;
                break;
            }
        }

        // Função para criar o skydome com textura
        function createSkydome(texture) {
            var geometry = new THREE.SphereGeometry(90, 32, 32,0,Math.PI * 2,0,Math.PI/2);

            var material = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.BackSide 
            });

            var skydome = new THREE.Mesh(geometry, material);

            skydome.position.set(0,-20,0)
		
            scene.add(skydome);
        }

        // Função para carregar a textura e criar o skydome
        function loadTextureAndCreateSkydome() {
            var textureLoader = new THREE.TextureLoader();
            // Carregue a textura da imagem
            textureLoader.load(
                'oskar_sky.png',
                function(texture) {
                    createSkydome(texture);
                },
                // Função de progresso (opcional)
                function(xhr) {
                    console.log((xhr.loaded / xhr.total * 100) + '% carregado');
                },
                // Função de erro (opcional)
                function(error) {
                    console.log('Erro ao carregar a textura', error);
                }
            );
        }



        function createScene(){
            scene = new THREE.Scene();

            loadTextureAndCreateSkydome();

            var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
            scene.add(ambientLight);

            directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
            directionalLight.position.set(12, 0, 12);
            directionalLight.target.position.set( 0,-9,0);
            directionalLight.castShadow = false; // Enable shadow casting

            // Set up shadow properties
            directionalLight.shadow.mapSize.width = 1024;  // Shadow map width in pixels
            directionalLight.shadow.mapSize.height = 1024; // Shadow map height in pixels
            directionalLight.shadow.camera.near = 0.5;     // Near plane of the shadow camera
            directionalLight.shadow.camera.far = 50;       // Far plane of the shadow camera
            // Set up orthographic shadow camera
            directionalLight.shadow.camera.left = -10;
            directionalLight.shadow.camera.right = 10;
            directionalLight.shadow.camera.top = 10;
            directionalLight.shadow.camera.bottom = -10;

            scene.add(directionalLight);

            var ring_1, ring_2, ring_3;
            all_objects = new THREE.Group();
            level_1 = new THREE.Group();
            level_2 = new THREE.Group();
            level_3 = new THREE.Group();
            level_1_lights = new THREE.Group();
            level_2_lights = new THREE.Group();
            level_3_lights = new THREE.Group();
            mobius_lights = new THREE.Group();

            cylinder = createCylinder(4.5, 18);
            
            ring_1 = createRing(4.5, 7.5, -2 , 1);
            level_1.add(ring_1)
            createRingFigures(6, -2, level_1, level_1_lights);
            level_1.position.set(0,2,0)
            //level_1.add(level_1_lights);
            //scene.add(level_1);

            ring_2 = createRing(7.5, 10.5, -2 , 1);
            level_2.add(ring_2)
            createRingFigures(9, -2, level_2, level_2_lights);
            level_2.position.set(0,2,0)
            //level_2.add(level_2_lights);
            //scene.add(level_2);

            ring_3 = createRing(10.5, 13.5, -2 , 1);
            level_3.add(ring_3)
            createRingFigures(12, -2, level_3, level_3_lights);
            level_3.position.set(0,2,0)
            //level_3.add(level_3_lights);
            //scene.add(level_3);


            var mobiusStrip = createMobiusStrip();
            //mobius_lights.rotation.x = Math.PI/2
            scene.add(mobius_lights);


            all_objects.add(cylinder, mobiusStrip, level_1, level_2 , level_3);
            scene.add(all_objects);

            scene.add(level_1_lights, level_2_lights, level_3_lights)

            scene.add(new THREE.AxesHelper(10));
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

            render();
        }

        function init() {
            // Renderer
            renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;
            document.body.appendChild(renderer.domElement);
            
            //Scene
            createScene();
            // Cameras
            createCameras();
            
            
            window.addEventListener("resize", onResize);
            window.addEventListener("keydown", onkeydown);
            window.addEventListener("keyup", onkeyup);

           
        }

        function animateCubes(cubes) {
            cubes.slice(1, 9).forEach(function(cube) {
                //cube.rotation.x += 0.01; // Rotate around the X axis
                cube.rotation.x += 0.01; // Rotate around the Z axis
                //cube.rotation.y += 0.01; // Rotate around the Y axis
            });
        }

        var level1Jumping = true, level2Jumping = true, level3Jumping = true;


        var level1JumpSpeed = 0.1, level2JumpSpeed = 0.1, level3JumpSpeed = 0.1; // Adjust as needed

        let previousTime = performance.now(); // Variable to store the previous timestamp

        function moveSpotLights(level_lights, level, spotlightMoveSpeed){
            var k=1;
            for(var i = 0; i < 23;i+=3){ //trocar 23 para 3 para ter apenas 1 spotlight por anel
                level_lights.children[i].position.copy(level.children[k].getWorldPosition(new THREE.Vector3()));
                level_lights.children[i].position.y -= 1.5;
                level_lights.children[i].target.position.copy(level.children[k].getWorldPosition(new THREE.Vector3()));
                level_lights.children[i+2].position.copy(level.children[k].getWorldPosition(new THREE.Vector3()));
                k++;
            }

        }

        function updadteSpotlightHelper(){

            for(var i = 2; i<= 24; i+=3){ //trocar 24 para 2 para ter apenas 1 spotlight por anel
                level_1_lights.children[i].update()
                level_2_lights.children[i].update()
                level_3_lights.children[i].update()
            }
        }

        var move_ring_1 = false, move_ring_2 =false, move_ring_3 = false;


        function animate() {

            const currentTime = performance.now(); // Get the current timestamp
            const deltaTime = (currentTime - previousTime) / 50; // Calculate the time difference since the last frame, in seconds
            previousTime = currentTime; // Update previous time

            updadteSpotlightHelper();

            
            if (switchCamera) {
                camera = cameraFront;
            } else {
                camera = cameraTop;
            }


            if (move_ring_1 ==true){            
                if (level_1.position.y >= 2) {
                    level1Jumping = false;
                } else if (level_1.position.y <= -15) {
                    level1Jumping = true;
                }

                // Update position based on animation state
                var spotlightMoveSpeed = 0.1;

                // Update position based on animation state
                if (level1Jumping) {
                    moveSpotLights(level_1_lights, level_1, spotlightMoveSpeed * deltaTime)
                    level_1.position.y += level1JumpSpeed * deltaTime;
                } else {
                    moveSpotLights(level_1_lights, level_1, -spotlightMoveSpeed * deltaTime) //negative speed means reverse moviment
                    level_1.position.y -= level1JumpSpeed * deltaTime;
                }
            }

            if (move_ring_2 ==true){
                if (level_2.position.y >= 2) {
                    level2Jumping = false;
                } else if (level_2.position.y <= -15) {
                    level2Jumping = true;
                }

                // Update position based on animation state
                if (level2Jumping) {
                    moveSpotLights(level_2_lights, level_2, spotlightMoveSpeed * deltaTime)
                    level_2.position.y += level2JumpSpeed * deltaTime;
                } else {
                    moveSpotLights(level_2_lights, level_2, -spotlightMoveSpeed * deltaTime)
                    level_2.position.y -= level2JumpSpeed * deltaTime;
                }
            }

            if (move_ring_3 ==true){
                if (level_3.position.y >= 2) {
                    level3Jumping = false;
                } else if (level_3.position.y <= -15) {
                    level3Jumping = true;
                }

                // Update position based on animation state
                if (level3Jumping) {
                    moveSpotLights(level_3_lights, level_3, spotlightMoveSpeed * deltaTime)
                    level_3.position.y += level3JumpSpeed * deltaTime;
                } else {
                    moveSpotLights(level_3_lights, level_3, -spotlightMoveSpeed * deltaTime)
                    level_3.position.y -= level3JumpSpeed * deltaTime;
                }
            }

            all_objects.rotation.y += 0.005 * deltaTime

            animateCubes(level_1.children);
            animateCubes(level_2.children);
            animateCubes(level_3.children);

            if (move_ring_1 == false ){
                moveSpotLights(level_1_lights, level_1, 0 * deltaTime)
            }
            if (move_ring_2 == false ){
                moveSpotLights(level_2_lights, level_2, 0 * deltaTime)
            }
            if (move_ring_3 == false){
                moveSpotLights(level_3_lights, level_3, 0 * deltaTime)
            }
            

            render()
            requestAnimationFrame(animate);
        }

        init();
        animate();