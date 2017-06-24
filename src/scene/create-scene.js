import BABYLON from 'babylonjs';
import {Store, Action} from 'redux';



console.log(BABYLON);


export default function createScene(canvas,engine,getStore) {

    console.log(canvas);

    var scene = new BABYLON.Scene(engine);
    //scene.clearColor = new BABYLON.Color3(1,1,1);


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


    const bounds = 5000;



    var skybox = BABYLON.Mesh.CreateBox("skyBox", bounds*2, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("/images/skyboxes/TropicalSunnyDay/TropicalSunnyDay", scene, ["_ft.jpg", "_up.jpg", "_rt.jpg", "_bk.jpg", "_dn.jpg", "_lf.jpg"]);//todo public folder
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;/**/




    // Sphere1 material
    var material = new BABYLON.StandardMaterial("kosh", scene);
    material.refractionTexture = skyboxMaterial.reflectionTexture;
    material.reflectionTexture = skyboxMaterial.reflectionTexture;
    material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    material.invertRefractionY = false;
    material.indexOfRefraction = 0.98;
    material.specularPower = 128;
    material.refractionFresnelParameters = new BABYLON.FresnelParameters();
    material.refractionFresnelParameters.power = 2;
    material.reflectionFresnelParameters = new BABYLON.FresnelParameters();
    material.reflectionFresnelParameters.power = 2;
    material.reflectionFresnelParameters.leftColor = BABYLON.Color3.Black();
    material.reflectionFresnelParameters.rightColor = BABYLON.Color3.White();



    const foodMaterial = material;
    const snakeMaterial = material;//new BABYLON.Color3(0, 0, 0);


    /*const foodMaterial = new BABYLON.StandardMaterial("texture2", scene);
    foodMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);*/



    //const snakeMaterial = new BABYLON.StandardMaterial("texture2", scene);
    //snakeMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    //snakeMaterial.alpha = 0.5;
    //snakeMaterial.backFaceCulling = false;



    //let snakePoints = [];
    //let snakeMesh = null;

    let score = 0;
    let snakeHead = new BABYLON.Vector3(0,0,0);



    const snakeMesh = BABYLON.Mesh.CreateSphere("snake", 16,  1, scene);
    snakeMesh.material = snakeMaterial;
    snakeMesh.position = snakeHead;



    //setInterval(function(){


        //snakePoints.push(snakeHead.clone());


        /*if(snakePoints.length>100){
            snakePoints = snakePoints.slice(snakePoints.length-100,100);
        }*/

        //console.log(snakePoints);

        //------------------------
        /*if(snakeMesh){
            snakeMesh.dispose();
        }*/

        //console.log(snakePoints);

        /*if(snakePoints.length>1) {
            snakeMesh = BABYLON.Mesh.CreateTube('snake', snakePoints, 2, 16, null, BABYLON.Mesh.NO_CAP, scene);
            snakeMesh.material = snakeMaterial;
        }*/


        //var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2*i, scene);
        //sphere.position = camera.position.clone();
        //sphere.position.x = i;
        //console.log('Kadiiiiim '+i,camera.position.x);


    //},300);


    function randomMass() {
        return Math.pow(Math.random()*10,3);
    }
    function massToScaling(mass) {
        const size3 = Math.pow(mass,1/2);
        return new BABYLON.Vector3(size3,size3,size3);
    }



    let speed = 10;
    let snakeMass = 100;
    let foods=[];

    for(let i=0;i<1000;i++){

        const mass = randomMass();

        const food = BABYLON.Mesh.CreateSphere("food", 16,  10, scene);
        food.scaling = massToScaling(mass);
        food.material = foodMaterial;
        food.position.x = (Math.random()-0.5)*2*bounds;
        food.position.y = (Math.random()-0.5)*2*bounds;
        food.position.z = (Math.random()-0.5)*2*bounds;


        let foodMove = new BABYLON.Vector3(0,0,0);
        foodMove.x += (Math.random()-0.5)*1;
        foodMove.y += (Math.random()-0.5)*1;
        foodMove.z += (Math.random()-0.5)*1;

        let done = false;


        foods.push({
            mesh: food,
            isDone: ()=>done,
            done:()=>{

                console.log('done');

                food.dispose();
                //food.material = snakeMaterial;
                done = true;

                //speed+=1;
                snakeMass += mass;

            },
            tick:()=>{

                /*if(!done) {
                    food.position.addInPlace(foodMove);

                    ['x', 'y', 'z'].forEach((axis)=> {
                        if (food.position[axis] > bounds)food.position[axis] = -bounds;
                        if (food.position[axis] < -bounds)food.position[axis] = bounds;
                    });
                }*/



        }});/**/

    }




    let food = BABYLON.Mesh.CreateSphere("food", 16, 8, scene);
    food.material = foodMaterial;

    function newFoodPosition(){
        food.position.x = Math.random()*100;
        food.position.y = Math.random()*100;
        food.position.z = Math.random()*100;
    };

    newFoodPosition();









    let tick = 0;

    scene.registerBeforeRender(function () {


        snakeMass = snakeMass*0.999;
        snakeMesh.scaling = massToScaling(snakeMass);


        const snakeMoveX = new BABYLON.Vector3(
            0,
            Math.sin(camera.rotation.x)*speed*-1,
            0,
        );
        const snakeMoveY = new BABYLON.Vector3(
            Math.sin(camera.rotation.y)*Math.cos(camera.rotation.x)*speed,
            0,
            Math.cos(camera.rotation.y)*Math.cos(camera.rotation.x)*speed
        );
        /*const snakeMoveZ = new BABYLON.Vector3(
            Math.sin(camera.rotation.z)*k,
            Math.cos(camera.rotation.z)*k,
            0
        );*/

        const snakeMove = snakeMoveX.add(snakeMoveY);


        snakeHead.addInPlace(snakeMove);



        camera.position = snakeHead.subtract(snakeMove.multiplyByFloats(10,10,10));//.add(snakeMove.multiply(new BABYLON.Vector3(1,0,1)).multiplyByFloats(5,5,5)));




        //console.log(snakeHead,snakeMove,camera.position );




        skybox.position = camera.position.multiplyByFloats(0.9,0.9,0.9);
        //skybox.position = camera.position.multiplyByFloats(0.1,0.1,0.1);



        //Balloon 1 intersection -- Precise = false




        foods.forEach((food)=>{

            if(tick>10 && !food.isDone()) {

                if (food.mesh.intersectsPoint(snakeHead)) {
                    food.done();
                }
            }


            food.tick();
        });


        //camera.fov =  (Math.sin(new Date()/1000*5)+1)/20*Math.PI+1;
        tick++;
    });



    // Creation of a ribbon

    /*let fragments = 20;

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
    ribbon.material.wireframe = true;*/



    return scene;

}