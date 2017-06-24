

class TorusGraph{

    static getGraphRange(){
        return({
            u: {min:0,max:Math.PI*2},
            v: {min:0,max:Math.PI*2}
        })

    }

    static getGraphPoint(u,v){

        let x,y,z;


        x = Math.cos(u)*(1.5+Math.cos(v));
        y = Math.sin(u)*(1.5+Math.cos(v));
        z = Math.sin(v);

        return(new BABYLON.Vector3(x,y,z));
    }
};

