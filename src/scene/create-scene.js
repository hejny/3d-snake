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

    let skybox;


    const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(process.env.PUBLIC_URL +"/images/skyboxes/TropicalSunnyDay/TropicalSunnyDay", scene, ["_ft.jpg", "_up.jpg", "_rt.jpg", "_bk.jpg", "_dn.jpg", "_lf.jpg"]);//todo public folder
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;


    // Sphere1 material
    var material = new BABYLON.StandardMaterial("kosh", scene);
    material.backFaceCulling=false;
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



    const takenMaterial = new BABYLON.StandardMaterial("texture2", scene);
    takenMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    //snakeMaterial.alpha = 0.5;
    takenMaterial.backFaceCulling = false;



    //let snakePoints = [];
    //let snakeMesh = null;

    let score = 0;
    function setScore(_score){
        score=_score;
        document.getElementById('score').innerText=score;
    }
    let snakeHead = new BABYLON.Vector3(0,0,0);


    let snakeMesh;








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
        const size3 = Math.pow(mass,1/3);
        return new BABYLON.Vector3(size3,size3,size3);
    }


    let speed,snakeMass,foods, interval;
    function newGame(){

        clearInterval(interval);
        setScore(0);
        camera.fov=1;

        scene.meshes.forEach((mesh) => {
            mesh.dispose();
        });
        scene.meshes = [];




        snakeMesh = BABYLON.Mesh.CreateSphere("snake", 16,  1, scene);
        snakeMesh.material = snakeMaterial;
        snakeMesh.position = snakeHead;



        skybox = BABYLON.Mesh.CreateBox("skyBox", bounds*2, scene);
        skybox.material = skyboxMaterial;




        speed = 15;
        snakeMass = 500;
        foods=[];

        let i;
        function addBall(){i++;

            let mass = randomMass();

            const food = BABYLON.Mesh.CreateSphere("food", 16,  1, scene);
            food.scaling = massToScaling(mass);
            food.position.x = (Math.random()-0.5)*2*bounds;
            food.position.y = (Math.random()-0.5)*2*bounds;
            food.position.z = (Math.random()-0.5)*2*bounds;

            let foodMove = new BABYLON.Vector3(0,0,0);
            foodMove.x += (Math.random()-0.5)*1;
            foodMove.y += (Math.random()-0.5)*1;
            foodMove.z += (Math.random()-0.5)*1;

            let done = false;
            let black = (Math.random()>0.8);
            let factor = 1+Math.random()/100;
            let treshold = 100000+Math.random()*1000000000;


            food.material = black?takenMaterial:foodMaterial;

            foods.push({
                id: `food${i}`,
                mesh: food,
                getRadius: ()=>food.scaling.x/2,
                isDone: ()=>done,
                isBlack: ()=>black,
                done:()=>{

                    console.log('done');

                    food.dispose();
                    //food.material = takenMaterial;
                    done = true;

                    //speed+=1;
                    snakeMass /= 1.05;

                },
                tick:()=>{

                    if(!done) {
                        mass*=factor;
                        food.scaling = massToScaling(mass);


                        if(mass>treshold){
                            //food.material = takenMaterial;
                            //factor = 1+((factor-1)*0.99);
                            //black=true;


                            if(mass>treshold*10){
                                //if(black) {
                                    factor=1;
                                //}else{
                                //    food.dispose();
                                //    done = true;
                                //}
                            }
                        }

                    }


                    /*if(!done) {
                     food.position.addInPlace(foodMove);

                     ['x', 'y', 'z'].forEach((axis)=> {
                     if (food.position[axis] > bounds)food.position[axis] = -bounds;
                     if (food.position[axis] < -bounds)food.position[axis] = bounds;
                     });
                     }*/



                }});/**/

        }
        interval = setInterval(addBall,500);
        for(let i=0;i<500;i++){
            addBall();
        }



    }

    newGame();





    /*let food = BABYLON.Mesh.CreateSphere("food", 16, 8, scene);
    food.material = foodMaterial;

    function newFoodPosition(){
        food.position.x = Math.random()*100;
        food.position.y = Math.random()*100;
        food.position.z = Math.random()*100;
    };

    newFoodPosition();*/









    let tick = 0;
    let currentFood =null;

    scene.registerBeforeRender(function () {

        speed = 4000/snakeMass;
        camera.fov += 0.0001;
        //camera.fov=1.3+(1/snakeMass);


        //snakeMass = snakeMass*0.99;
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

        /*const position = snakeHead;
        ['x', 'y', 'z'].forEach((axis)=> {
            if (position[axis] > bounds)position[axis] = -bounds;
            if (position[axis] < -bounds)position[axis] = bounds;
        });*/


        camera.position = snakeHead.subtract(snakeMove.multiplyByFloats(10,10,10));//.add(snakeMove.multiply(new BABYLON.Vector3(1,0,1)).multiplyByFloats(5,5,5)));




        //console.log(snakeHead,snakeMove,camera.position );




        skybox.position = camera.position;//.multiplyByFloats(0.9,0.9,0.9);
        //skybox.position = camera.position.multiplyByFloats(0.1,0.1,0.1);



        //Balloon 1 intersection -- Precise = false



        foods.forEach((food)=>{

            if(tick>10) {


                //console.log(BABYLON.Vector3.Distance(food.mesh.position,snakeHead),food.getRadius());
                if (BABYLON.Vector3.Distance(food.mesh.position,snakeHead)<food.getRadius()) {

                    if(food.isBlack()){
                        //console.log(currentFood.id,food.id);
                        //if(currentFood.id !== food.id) {
                        alert(`Game Over. You have ${score} points!`);
                        newGame();
                        //}
                    }else{

                        if(!food.isDone()) {
                            food.done();
                            setScore(score+1);
                            currentFood = food;
                        }
                    }

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