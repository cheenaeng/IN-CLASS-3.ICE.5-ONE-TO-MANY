
import pg from 'pg';
const { Client } = pg;

// set the way we will connect to the server
const pgConnectionConfigs = {
  user: 'cheenaeng',
  host: 'localhost',
  database: 'cat_owners',
  port: 5432, // Postgres server always runs on this port
};

// create the var we'll use
const client = new Client(pgConnectionConfigs);

// make the connection to the server
client.connect();

// create the query done callback
const whenQueryDone = (error, result) => {
  // this error is anything that goes wrong with the query
  if (error) {
    console.log('error', error);
  } else {
    // rows key has the data
    console.log(result.rows);
  }

  // close the connection
  client.end();
};

const COMMAND = process.argv[2]
const CREATEOWNER = "create-owner"
const CREATECAT = "create-cat"
const SHOWCATSINFO = "cats"

const addOwner =() =>{
  const inputName = process.argv[3]
  const inputData = [inputName]
  const sqlQuery = `INSERT INTO owners (name) VALUES ($1)`
  client.query(sqlQuery,inputData, whenQueryDone);
}

const addCat =() =>{
  const inputOwnerId  = process.argv[3]
  const inputCatName = process.argv[4]
  const inputData = [inputOwnerId,inputCatName]
  const sqlQuery = `INSERT INTO cats (name,owners_id) VALUES ($2,$1)`
  client.query(sqlQuery,inputData, whenQueryDone);
}

const showCatsinfo = () =>{
  const showAllCatsSqlQuery =`SELECT * FROM cats` 
  const whenShowCatsQueryDone= (error, result)=>{
    console.log(result.rows);

    const catsName = result.rows.map((cat, index) => `${cat.id}.${cat.name}`)
    console.log(catsName)

  // need to find the corresponding owners id --> in an array 
  const ownerslist= result.rows.map (cat=>cat.owners_id)

  result.rows.forEach((cat)=> {
    const showOwnersQuery = `SELECT * FROM owners where id = ${cat.owners_id}`
    console.log(showOwnersQuery)

    const whenShowOwnersQueryDone = (error,result) =>{
    if (error) {
    console.log('error', error);
    } else {
      // rows key has the data
      console.log(result.rows)
      const ownerName = result.rows.map(owner => owner.name)
      console.log(ownerName)
      const outputName = catsName.map(cat => cat.concat(`-owner - ${ownerName}`))
      
      console.log(outputName)
      client.end()
    }
    }
    client.query(showOwnersQuery, whenShowOwnersQueryDone)
    })

  } 
  client.query(showAllCatsSqlQuery, whenShowCatsQueryDone);

}


switch(COMMAND){
  case CREATEOWNER:{
    addOwner()
    break;
  }

  case CREATECAT:{
    addCat()
    break;
  }

  case SHOWCATSINFO:{
    showCatsinfo()
  }

  default: {
    console.log("unkownd"+COMMAND)
  }

}

