require('dotenv').config();
const {MongoClient} = require('mongodb')
const uri = process.env.URI
const client = new MongoClient(uri)
let db;

async function wait() {
    try {
        await client.connect();
        db = client.db().collection('users')
    } catch (e) {
        console.log('there was an error connecting to the database: ', e)
    }
}
wait();

//this function should return a user if that user exists in the db
//else this function returns false
async function doesUserExist(details) {
    const filter = {userId: details.userId};
    const options = {upsert : true};
    const updateDoc = {
        $set: {
            userId: details.userId, 
            accessToken: details.accessToken, 
            refreshToken: details.refreshToken,
            cookie: details.cookie,
        }}
    await db.updateOne(filter, updateDoc, options);
}

async function getToken(query) {
    let token = await db.findOne({cookie: query});
    // console.log('this should be the token: ', token)
    return token.accessToken;
}

//this function adds the user if they do not exist in the db
// async function addUser(details) {
//     if (await doesUserExist(details) === false) {
//         console.log('i am adding the user')
//         try {
//             await db.insertOne(details);
//             return { success: true };
//         } catch (e) {
//             if (String(e).startsWith('MongoError: E11000 duplicate key error')) {
//                 return { error: "a user with the given id already exists"}
//             }
//             console.log('there was an error adding the user: ', e);
//             return { error: e };
//         }
//     }
// }



// async function main() {
//     console.log('dbfuncs working???')

//     try {
//         await client.connect();
//         // await listDatabases(client);
//         await getUser(client);
//     } catch (e) {
//         console.log('there was an error in the databaseFunctions: ', e)
//     } finally {
//         await client.close();
//     }


//     async function listDatabases(client){
//         databasesList = await client.db().admin().listDatabases();
//         console.log('Databases: ');
//         databasesList.databases.forEach(db => console.log(` - ${db.name}`));
//     }

// }

// main().catch(console.error)


module.exports = {
    doesUserExist: doesUserExist,
    getToken: getToken,
}