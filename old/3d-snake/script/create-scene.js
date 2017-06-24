function  createScene() {
	
	
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(1,1,1);


    /*var camera = new BABYLON.ArcRotateCamera("Camera"
        , 1/4 * Math.PI, 1/2 * Math.PI
        , 5
        , BABYLON.Vector3.Zero()
        , scene);

    camera.attachControl(canvas, true);*/
    
    
    
    var camera = new BABYLON.FreeCamera("FreeCamera"
    , new BABYLON.Vector3(0, 0, 0)
    , scene
    );
    camera.attachControl(canvas, true);
	


    var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);







	var skybox = BABYLON.Mesh.CreateBox("skyBox", 10000.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("http://www.babylonjs-playground.com/textures/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;/**/
    
    
    
    //BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

	let foodMaterial = new BABYLON.StandardMaterial("texture2", scene);
    foodMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); 

    
    
	let snakeMaterial = new BABYLON.StandardMaterial("texture2", scene);
    snakeMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0); 
    snakeMaterial.alpha = 0.5;
    snakeMaterial.backFaceCulling = false;
    
    
    
    let snakePoints = [];
    let snakeMesh = null;
	setInterval(function(){
		
		
		snakePoints.push(camera.position.clone());
		
		
		
		//------------------------
		if(snakeMesh){
			snakeMesh.dispose();
		}
		
		snakeMesh =  BABYLON.Mesh.CreateTube('snake', snakePoints, 1, 16, null, BABYLON.Mesh.NO_CAP, scene);
		snakeMesh.material = snakeMaterial;
		
		
		//var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2*i, scene);
		//sphere.position = camera.position.clone();
		//sphere.position.x = i;
		//console.log('Kadiiiiim '+i,camera.position.x);
		
		
	},100);



	let food = BABYLON.Mesh.CreateSphere("food", 16, 8, scene);
	food.material = foodMaterial;

	function newFoodPosition(){
		food.position.x = Math.random()*100;
		food.position.y = Math.random()*100;
		food.position.z = Math.random()*100;
	};
	
	newFoodPosition();
	
	
	let score = 0;

	scene.registerBeforeRender(function () {


            camera.position.x += Math.sin(camera.rotation.y)*.5;
            camera.position.z += Math.cos(camera.rotation.y)*.5;



			//Balloon 1 intersection -- Precise = false
			if(snakeMesh)
			if (food.intersectsPoint(camera.position)) {

				newFoodPosition();
				
				score++;
				scoreElement.innerText = score;
				//alert('Huraaaaaaaa');
			}
			
			
			
			//camera.fov =  (Math.sin(new Date()/1000*5)+1)/20*Math.PI+1;

	});



    // Creation of a ribbon

    let fragments = 20;

    let points2D = [];
    let points1D;

    let range = TorusGraph.getGraphRange();
    for (var u = range.u.min; u < range.u.max; u+=1/fragments) {

        points1D = [];
        for (var v = range.v.min; v < range.v.max; v+=1/fragments) {


            points1D.push(TorusGraph.getGraphPoint(u,v));
        }

        points2D.push(points1D);

    }


    // (name, array of paths, closeArray, closePath, offset, scene)
    var ribbon = BABYLON.Mesh.CreateRibbon("ribbon", points2D, false, false, 0, scene);
    ribbon.material = new BABYLON.StandardMaterial("texture", scene);
    ribbon.material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    ribbon.material.backFaceCulling = false;
    ribbon.material.wireframe = true;








    return scene;



}
