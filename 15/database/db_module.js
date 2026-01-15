const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');//12-байтовый идентификатор
const databaseName = 'BSTU';


const connectionString = 'mongodb://student:fitfit@ac-gq7tdmn-shard-00-02.cyvrnpw.mongodb.net:27017/BSTU?ssl=true&authSource=admin';

function DB() {

    this.client = new MongoClient(connectionString);
    
    // промис 
    this.client.connect()
        .then(() => { console.log(`\n[OK] Успешное подключение к MongoDB Atlas (Base: ${databaseName})\n`); })
        .catch(err => { console.error("\n[ERROR] Ошибка подключения:", err); });

    // =============================================   SELECT   =============================================

    this.getFaculties = async () => await this.client.db().collection('faculty').find({}).toArray();

    this.getPulpits = async () => await this.client.db().collection('pulpit').find({}).toArray();

    this.getFaculty = async (faculty) => await this.client.db().collection('faculty').find({ faculty: faculty }).toArray();

    this.getPulpit = async (pulpit) => await this.client.db().collection('pulpit').find({ pulpit: pulpit }).toArray();

    this.getFacultyByCode = async (faculty_code) => await this.client.db().collection('faculty').find({ faculty_code: faculty_code }).toArray();

    this.getPulpitByCode = async (pulpit_code) => await this.client.db().collection('pulpit').find({ pulpit_code: pulpit_code }).toArray();

    this.getFacultyPulpits = async (faculties) => await this.client.db().collection('pulpit').find({ faculty: { $in: faculties } }).toArray();

    // =============================================   INSERT   =============================================

    this.insertFaculty = async (fields) => {
        let collection = this.client.db().collection('faculty');
        let facultyToFind = JSON.parse('{"faculty": "' + fields.faculty + '"}');//фильтр 
        console.log('INSERT:\t', fields);

        await this.findOneAndThrowException('faculty', facultyToFind, true, 'This faculty already exists');

        let insertResult = await collection.insertOne(fields);
        console.log('RESULT:', insertResult, '\n');

        return collection.findOne(fields).then(record => {
            if (!record) throw 'There is no records';
            else return record;
        });
    }

    this.insertPulpit = async (fields) => {
        let collection = this.client.db().collection('pulpit');
        let pulpitToFind = JSON.parse('{ "pulpit": "' + fields.pulpit + '" }');
        let facultyToFind = JSON.parse('{"faculty": "' + fields.faculty + '"}');
        console.log('INSERT:\t', fields);

        try {
            // Проверяем существование кафедры
            const existingPulpit = await collection.findOne(pulpitToFind);
            if (existingPulpit) {
                throw new Error('Кафедра с таким названием уже существует');
            }

            // Проверяем существование факультета
            const facultyCollection = this.client.db().collection('faculty');
            const existingFaculty = await facultyCollection.findOne(facultyToFind);
            if (!existingFaculty) {
                throw new Error(`Факультет "${fields.faculty}" не существует. Доступные факультеты: ${(await facultyCollection.find({}, { projection: { faculty: 1, _id: 0 } }).toArray()).map(f => f.faculty).join(', ')}`);
            }

            // Если все проверки пройдены, добавляем кафедру
            let insertResult = await collection.insertOne(fields);
            console.log('RESULT:', insertResult, '\n');

            const insertedRecord = await collection.findOne(fields);
            if (!insertedRecord) {
                throw new Error('Ошибка при добавлении кафедры');
            }
            return insertedRecord;
        } catch (err) {
            console.error('INSERT ERROR:', err);
            throw err;
        }
    }

    // =============================================   UPDATE   =============================================

    this.updateFaculty = async (fields, newFacultyName) => {
        let collection = this.client.db().collection('faculty');
        console.log('UPDATE:\t', fields);
        const updateFields = {};
        if (fields.faculty) updateFields.faculty = fields.faculty;
        if (fields.faculty_name) updateFields.faculty_name = fields.faculty_name;
        if (fields.faculty_code) updateFields.faculty_code = fields.faculty_code;

        try {
            const objectId = new ObjectId(fields._id);
            console.log('Searching by ObjectId:', objectId);
            const doc = await collection.findOne({ _id: objectId });
            console.log('Found document:', doc);

            if (!doc) {
                console.log('Faculty not found');
                return { value: null };
            }
            const result = await collection.updateOne(
                { _id: objectId },
                { $set: updateFields }
            );
            console.log('UPDATE RESULT:', result);
            const updatedDoc = await collection.findOne({ _id: objectId });
            console.log('Updated document:', updatedDoc);
            return { value: updatedDoc };
        } catch (err) {
            console.error('UPDATE ERROR:', err);
            throw err;
        }
    }

    this.updatePulpit = async (fields, newPulpitName, newFaculty) => {
        let collection = this.client.db().collection('pulpit');
        console.log('UPDATE:\t', fields);
        const updateFields = {};
        if (fields.pulpit) updateFields.pulpit = fields.pulpit;
        if (fields.pulpit_name) updateFields.pulpit_name = fields.pulpit_name;
        if (fields.faculty) updateFields.faculty = fields.faculty;
        if (fields.pulpit_code) updateFields.pulpit_code = fields.pulpit_code;

        try {
            const objectId = new ObjectId(fields._id);
            console.log('Searching by ObjectId:', objectId);
            const doc = await collection.findOne({ _id: objectId });
            console.log('Found document:', doc);

            if (!doc) {
                console.log('Pulpit not found');
                return { value: null };
            }
            if (fields.faculty) {
                let facultyToFind = JSON.parse('{"faculty": "' + fields.faculty + '"}');
                await this.findOneAndThrowException('faculty', facultyToFind, false, 'There is no such faculty');
            }
            const result = await collection.updateOne(
                { _id: objectId },
                { $set: updateFields }
            );
            console.log('UPDATE RESULT:', result);
            const updatedDoc = await collection.findOne({ _id: objectId });
            console.log('Updated document:', updatedDoc);
            return { value: updatedDoc };
        } catch (err) {
            console.error('UPDATE ERROR:', err);
            throw err;
        }
    }

    // =============================================   DELETE   =============================================

    this.deleteFaculty = async (facultyToDelete) => {
        let collection = this.client.db().collection('faculty');
        console.log('DELETE:\t', facultyToDelete);

        const doc = await collection.findOne({ faculty_code: facultyToDelete });
        console.log('Found document to delete:', doc);

        if (!doc) {
            console.log('Faculty not found');
            return null;
        }

        return collection.findOneAndDelete({ faculty_code: facultyToDelete });
    }

    this.deletePulpit = async (pulpitToDelete) => {
        let collection = this.client.db().collection('pulpit');
        console.log('DELETE:\t', pulpitToDelete);

        const doc = await collection.findOne({ pulpit_code: pulpitToDelete });
        console.log('Found document to delete:', doc);
        if (!doc) {
            console.log('Pulpit not found');
            return null;
        }
        return collection.findOneAndDelete({ pulpit_code: pulpitToDelete });
    }

    // =============================================   UTILS   =============================================

    this.findOneAndThrowException = async (collectionName, fieldToFind, boolCondition, errorMessage) => {
        let collection = this.client.db().collection(collectionName);
        await collection.findOne(fieldToFind).then(record => {
            if (boolCondition) {
                if (record) throw errorMessage;
                else return record;
            }
            else {
                if (!record) throw errorMessage;
                else return record;
            }
        });
    }
}
module.exports = () => new DB();