/**
 * Functions related to retrieve and set the
 * details of a unit, in the LocalStorage
 * jacoblarsen.net@gmail.net 
 **/

/**
 * Initialize the LS
 * Mostly for testing purposes
 **/
function initLS(){
  if(typeof(Storage)!=="undefined"){
    var myUnits = [];
      myUnits[0] = "Ulla;car;255,255,0;0;0;";
      myUnits[1] = "cyklen;bike;192,192,192;0;0;";
      //myUnits[2] = "C3;car;66,87,155;0;0;";
      //myUnits[3] = "Fars;car;153,155,156;0;0;";
      localStorage["units"] = JSON.stringify(myUnits);
    } else {
      alert("Sorry, your unit does not support local storage");
  }
}


var properties = new Array("id","type","color","lat","lng","adress"); 

/**
 * Get the value af a property, of LS entry 'id'
 **/
function getUnitDetail(id, property){
  // An array of properties for the id'th entry in LS
  var unit = JSON.parse(localStorage['units'])[id].split(";");
  return unit[properties.indexOf(property)];
}

/**
 * Set the value of a property of LS entry 'id'
 **/
function setDetail(id, property, value){
  var units=JSON.parse(localStorage['units']);
  var unit = units[id];
  var detail = unit.split(";");
  detail[properties.indexOf(property)] = value;
  units[id] = arr2String(detail);
  localStorage["units"] = JSON.stringify(units);  
}


/********* Helper Methods **************/

/**
 * Turns an array into a ';' seperatede string
 */
function arr2String(arr){
  var ret = "";
  for (var i = 0; i <= arr.length ; i++) {
    ret = ret.concat(arr[i] + ";");
  }
  return ret;
}
    




  
  



