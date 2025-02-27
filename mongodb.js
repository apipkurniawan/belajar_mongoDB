// running mongodb server
// redirect to path : /Users/apipkurniawan/downloads/software/mongodb-macos-aarch64-8.0.4
// add command : ./bin/mongod --dbpath=data

// running mongo shell
// redirect to path : /Users/apipkurniawan/downloads/software/mongosh-2.3.9-darwin-arm64
// ./bin/mongosh "mongodb://localhost:27017/test"

// notes :
// mongodb server must running
// mongodb client bisa pakai mongo compas(GUI) atau mongo shell(command line)



// create database
// use latihan_cms


// create collection/table
db.createCollection('customers');

db.createCollection('products');

db.createCollection('orders');


// insert data
db.customers.insertOne({ _id: 'apip', name: 'apip kurniawan'})

db.products.insertMany([{ _id: '3', name: 'jeruk', price: new NumberLong('3000')}, { _id: '4', name: 'mangga', price: new NumberLong('2000')}])

db.products.insertMany([
    { _id: '5', name: 'iphone 11', price: new NumberLong('300000'), category: 'phone'}, 
    { _id: '6', name: 'mangga', price: new NumberLong('20000'), category: 'food'},
    { _id: '7', name: 'macbook M3', price: new NumberLong('2000000'), category: 'laptop'}
])

db.orders.insertOne(
    { 
        _id: new ObjectId(), 
        total: new NumberLong('8000'), 
        items: [
            { 
                product_id: '1', 
                price: new NumberLong('13000'), 
                quantity: new NumberInt(2)
            }, 
            { 
                product_id: '2', 
                price: new NumberLong('8000'), 
                quantity: new NumberInt(4)
            }
        ] 
    }
)


// get data
db.customers.find({ _id: 'apip' })

db.products.find({ price: new NumberLong('2000') })

db.products.find({ price: { $gt: new NumberLong('30000') } })

db.products.find({ category: { $in: ['food', 'laptop']} })

db.products.find({ $and: [{ category: { $in: ['food', 'laptop']} }, { price: { $lt: new NumberLong('30000') } }] })

db.products.find({ category: { $exists: true } })

db.products.find({ name: { $regex: /mang/, $options: 'i' } })


// query modifier
db.products.find({}).count()

db.products.find({}).limit(2)

db.products.find({}).sort({ category: 1, name: -1 }) // category asc, name, desc


// update data
db.products.updateOne({ _id: '3' }, { $set: { price: new NumberLong('4000') } })

db.products.updateMany({ category: 'food' }, { $set: { price: new NumberLong('5000') } })


// drop column
db.products.updateOne({ _id: '3' }, { $unset: { price: '' } })


// delete data
db.products.deleteOne({ _id: '3' })


// bulk write => instruksi untuk melakukan beberapa operasi sekaligus
db.customers.bulkWrite([
    {insertOne: {document: { _id: 'tata', name: 'tata alfian'}}},
    {insertOne: {document: { _id: 'dede', name: 'dede tanos'}}}
])


// indexes
db.products.createIndex({ category: 1 })


// security - authentication
// create user
db.createUser(
    {
        user: 'apip',
        pwd: 'apip123',
        roles: ['userAdminAnyDatabase', 'readWriteAnyDatabase']
    }
)

db.getUsers()

// connect to database with user
// 1. running ulang mongodb server :
// ./bin/mongod --auth --dbpath=data

// 2. running ulang mongo shell :
// ./bin/mongosh "mongodb://apip:apip123@localhost:27017/latihan_cms?authSource=admin"

// 3. add uri connection di mongo compas : 
// mongodb://apip:apip123@localhost:27017/latihan_cms?authSource=admin


// security - authorization
// create user
db.createUser(
    {
        user: 'tata',
        pwd: 'tata123',
        roles: [{
            role: 'read',
            db: 'latihan_cms'
        }]
    }
)
db.createUser(
    {
        user: 'dadan',
        pwd: 'dadan123',
        roles: [{
            role: 'readWrite',
            db: 'latihan_cms'
        }]
    }
)

// create roles
db.createRole(
    {
        role: 'session_management',
        roles: [
            { role: 'read', db: 'latihan_cms' }
        ],
        privileges: [
            { 
                resource: 
                { 
                    db: 'latihan_cms', 
                    collection: 'sessions' 
                }, 
                actions: ['insert'] 
            }
        ]
    }
)

db.getRoles()
db.getRoles({showPrivileges: true})


// backup database
// redirect to path : /Users/apipkurniawan/downloads/software/mongodb-database-tools-macos-arm64-100.11.0
// backup using mongodump : 
// ./bin/mongodump --uri="mongodb://apip:apip123@localhost:27017/latihan_cms?authSource=admin" --out=/Users/apipkurniawan/Downloads/mongoDB/mongodb-backup
// backup using mongoexport : 
// ./bin/mongoexport --uri="mongodb://apip:apip123@localhost:27017/latihan_cms?authSource=admin" --out=/Users/apipkurniawan/Downloads/mongoDB/customers.json --collection=customers


// restore database
// redirect to path : /Users/apipkurniawan/downloads/software/mongodb-database-tools-macos-arm64-100.11.0
// restore hasil mongodump : 
// ./bin/mongorestore --uri="mongodb://apip:apip123@localhost:27017/latihan_cms_restore?authSource=admin" --dir=/Users/apipkurniawan/Downloads/mongoDB/mongodb-backup/latahan_cms
// restore hasil mongoexport :
// ./bin/mongoimport --uri="mongodb://apip:apip123@localhost:27017/latihan_cms_import?authSource=admin" --file=/Users/apipkurniawan/Downloads/mongoDB/customers.json --collection=customers