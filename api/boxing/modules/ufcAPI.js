 

var UfcAPI = require('ufc-api');

var ufc = new UfcAPI({

});

var allFighters=null;


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}



//helper methods

function get_id_of_fighter_by_fname(fName){
    
    var fName_processed= capitalizeFirstLetter(fName);

    return new Promise((resolve,reject)=>{
        fighter_by_first_name(fName_processed).then(d=>{
             resolve(d[0].id)
        }).catch(err=>{
            reject(err);
        })
    })
    
}


 

function allfighters(){
    //grabs all fighters

    return new Promise((resolve,reject)=>{
        
        ufc.fighters(function(err,response){
            if(err){
                reject(err)
            }else{
                resolve(response.body)
            }
        })

    })
}

function fighters_by_class(weightClass){
    //grab fighters by the weight class division they are in
    
    return new Promise((resolve,reject)=>{
        //grabs title holder by class
    
        var wc= weightClass.split(" ");
    
        var wc_processed=null;
        //makes the parameter up to scratch to be quries 
    
        if(wc.length==2){
            //their are two weight class
            
            wc_processed= capitalizeFirstLetter(wc[0])+"_"+capitalizeFirstLetter(wc[1]);
        }else{
            //only single weight class
            wc_processed= capitalizeFirstLetter(wc[0])
        }
         console.log(wc_processed);
         
         ufc.fighters(function(err,response){
            if(err){
                reject(err)
            }else{

                var d= response.body;
                
                var holders=d.filter(th=>{
                    if(th.weight_class==wc_processed){
                        return th;
                    }
                })
                console.log(holders);
                resolve(holders);
            }
        })
        
        })
     
    
}

function title_holders(){
    //grab all fighters will titles
    return new Promise((resolve,reject)=>{
        
        ufc.titleHolders(function(err,response){
            if(err){
                reject(err)
            }else{
                resolve(response.body)
            }
        })

    })
}

function title_holder_by_class(weightClass){

    return new Promise((resolve,reject)=>{
    //grabs title holder by class

    var wc= weightClass.split(" ");

    var wc_processed=null;
    //makes the parameter up to scratch to be quries 

    if(wc.length==2){
        //their are two weight class
        
        wc_processed= capitalizeFirstLetter(wc[0])+"_"+capitalizeFirstLetter(wc[1]);
    }else{
        //only single weight class
        wc_processed= capitalizeFirstLetter(wc[0])
    }
     console.log(wc_processed);

    title_holders().then(d=>{

        var holders=d.filter(th=>{
            if(th.weight_class==wc_processed){
                return th;
            }
        })
        console.log(holders);
        resolve(holders);

    }).catch(err=>{
        reject(err);
    })
    })
 

    
 
 


}



function fighter_by_id(id){
    //grabs a single fighters detail by id

    return new Promise((resolve,reject)=>{
        //grabs title holder by class
    
        ufc.fighters(function(err,response){

            if(err){
                reject(err)
            }


            var d=response.body;

            var holders=d.filter(th=>{
                if(th.id==id){
                    return th;
                }
            })
            console.log(holders);
            resolve(holders);
            
        })
     
        })
}

function fighter_by_first_name(fname){
    return new Promise((resolve,reject)=>{

    //grabs a single fighter detail by first name

    var fName_processed= capitalizeFirstLetter(fname);
    //capitalizes the first letter of the first name
    ufc.fighters(function(err,response){
        if(err){
            reject(err)
        }
        var d=response.body;

        var holders=d.filter(th=>{
            if(th.first_name==fName_processed){
                return th;
            }
        })
         resolve(holders);

    });


});



}


function all_events(){
    return new Promise((resolve,reject)=>{
        //grabs all ufc events
        ufc.events(function(err,response){
            if(err){
                reject(err);
            }
            resolve(response.body);
        })
    })
    
}

function event_by_fighter_id(id){
    return new Promise((resolve,reject)=>{
    //grabs ufc events by id
    ufc.events(function(err,response){

        if(err){
            reject(err);
        }

        var d= response.body;


        var holders=d.filter(th=>{
            if(th.main_event_fighter1_id==id || th.main_event_fighter2_id==id ){
                return th;
            }
        })
        resolve(holders);
    })
    })
     
}

function event_by_fighter_fname(fname){
    return new Promise((resolve,reject)=>{
        //grabs all events by a fighter by first name
        get_id_of_fighter_by_fname("conor").then(d=>{
            event_by_fighter_id(d).then(d=>{
                resolve(d)
            }).catch(err=>{
                reject(err)
            })
        }).catch(err=>{
            reject(err);
        })
    })
   
}
 
module.exports={
    allfighters,
    title_holders,
    title_holder_by_class,
    fighters_by_class,
    fighter_by_id,
    fighter_by_first_name,
    all_events,
    event_by_fighter_id,
    event_by_fighter_fname
}