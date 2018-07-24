'use strict';

let restaurantsJSON,
request,
objectStore,
tx,
reateIndexedDB;
const dataStore= [];

const dbName = "dbRestaurant-static";
const URL = "http://localhost:1337/restaurants";
const opt = {credentials: 'include'};
var db;

const dbVersion = 1; // Use a long long for this value (don't use a float)
const dbStoreName = 'restaurants';


 // create DB function createIndexedDB()
function createIndexedDB() {

  if (!('indexedDB' in window)) {return null;}
  return idb.open(dbName, dbVersion, (upgradeDb) =>  {
    if (!upgradeDb.objectStoreNames.contains('restaurants')) {
      const store = upgradeDb.createObjectStore(dbStoreName, {keyPath: 'id'});
      store.createIndex('by-name', 'name');
     // return store;
    }
  });
  
  
}

const dbPromise = createIndexedDB();


/**
  * @param {string} dbs database name.
   * @param {string} store_name
   * @param {string} mode either "readonly" or "readwrite"
   */
  function getObjectStore(dbs,storeName, mode) {
            let tx = dbs.transaction(storeName, mode);
        return tx.objectStore(storeName);
              
  }

//  add people to "people"
//let restaurantsStore = getObjectStore(dbStoreName,'readonly');

function saveData(restaurantsJSON) {
  let events = restaurantsJSON;
  console.log('restaurantsJSON ', events);
  
  return dbPromise.then(db => {
    //const tx = db.transaction('restaurants', 'readwrite');
    //const store = tx.objectStore('restaurants');
    const store = getObjectStore(db,dbStoreName, 'readwrite');
    
    
    return Promise.all(events.map(event => store.add(event)))
    .catch(() => {
      //tx.abort();
      throw Error('Events were not added to the store');
    });
  });
}

// get data from the server
fetch(URL,opt)
    .then(response => response.json())
    .then((jsonData) => {
     //restaurantsJSON = json;
     console.log('fetchData: ',jsonData);
     let localDd = saveData(jsonData);
     //saveEventDataLocally(jsonData);
     
     
    })
    .catch((error) => {
     console.log('There has been a problem with your fetch operation: ', error.message);
     
    });


//let resultData(URL, opt);


// get local data
// get all restaurants
function getLocalEventData() {
  
  return dbPromise.then(db => {
    const tx = db.transaction('restaurants', 'readonly');
    const store = tx.objectStore('restaurants');
    return store.getAll();
  });
}
function getLocalData() {
  
  return dbPromise.then((db) => {
        //var tx = db.transaction('restaurants', 'readonly');
        //var store = tx.objectStore('restaurants');
        const store = getObjectStore(db,dbStoreName, 'readonly');
       
        return store.getAll();
      }).then((items) => {
        console.log('Restaurants by id:', items);
      });
}
let locaDataDb = getLocalData();
console.log('All Restaurants:', getLocalData);

let retrievedData = getLocalEventData();
console.log("I catched You: ", retrievedData);
//retrievedData.then(data => console.log(data));

function getAllData(){
   return dbPromise.then((db) => {
    const store = getObjectStore(db,dbStoreName, 'readonly');
    return store.openCursor();
  });

}

/**
// create indexDb
function createDB() {
  if (!('indexedDB' in window)) {return null;}
  return idb.open(dbName, dbVersion,(upgradeDb) => {
    var store = upgradeDb.createObjectStore(dbStoreName, {
      keyPath: 'id'
    });
    store.createIndex('by-name', 'name');
    console.log('idb implemented');
  });
  
}
 const dbPro = createDB();

 */
