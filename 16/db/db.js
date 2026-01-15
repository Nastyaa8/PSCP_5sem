const sql = require('mssql');

const config = {
    user: 'student',
    password: 'fitfit',
    server: 'localhost',
    database: 'SAA',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL (SAA Database)');
        return pool;
    })
    .catch(err => console.log('Database Connection Failed! ', err));

class Db {
    async getAll(tableName) {
        const pool = await poolPromise;
        const result = await pool.request().query(`SELECT * FROM ${tableName}`);
        return result.recordset;
    }

    async getOne(tableName, pkName, pkValue) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.NVarChar, pkValue)
            .query(`SELECT TOP(1) * FROM ${tableName} WHERE ${pkName} = @id`);
        return result.recordset;
    }


    async upsert(tableName, pkName, args) {
        try {
            const pool = await poolPromise;
            const request = pool.request();

            // Добавляем параметры
            Object.keys(args).forEach(key => {
                let type = Number.isInteger(args[key]) ? sql.Int : sql.NVarChar;
                request.input(key, type, args[key]);
            });

            const fields = Object.keys(args);
            
            // Поля для UPDATE (исключаем PK)
            const setClause = fields
                .filter(f => f !== pkName)
                .map(f => `${f} = @${f}`)
                .join(', ');

            // Поля для INSERT
            const cols = fields.join(', ');
            const vals = fields.map(f => `@${f}`).join(', ');

         
            const command = `
                IF EXISTS (SELECT * FROM ${tableName} WHERE ${pkName} = @${pkName})
                BEGIN
                    UPDATE ${tableName} SET ${setClause} WHERE ${pkName} = @${pkName}
                END
                ELSE
                BEGIN
                    INSERT INTO ${tableName} (${cols}) VALUES (${vals})
                END
            `;

            await request.query(command);
            
            // Возвращаем аргументы обратно, чтобы GraphQL не выдавал null
            return args; 
        } catch (err) {
            console.error('UPSERT Error:', err);
            throw err;
        }
    }

    async delete(tableName, pkName, pkValue) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.NVarChar, pkValue)
            .query(`DELETE FROM ${tableName} WHERE ${pkName} = @id`);
        return result.rowsAffected[0] > 0;
    }

    async getSubjectsByFaculties(facultyCode) {
        const pool = await poolPromise;
        return (await pool.request()
            .input('f', sql.NVarChar, facultyCode)
            .query(`
                SELECT s.*, p.FACULTY 
                FROM SUBJECT s
                JOIN PULPIT p ON s.PULPIT = p.PULPIT
                WHERE p.FACULTY = @f
            `)).recordset;
    }
}

module.exports = Db;