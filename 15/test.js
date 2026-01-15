const DB = require('./database/db_module');
const db = DB();

console.log("Ждем подключения...");

setTimeout(async () => {
    try {
        const result = await db.getFaculties();
        console.log("Данные из базы:", result);
    } catch (e) {
        console.error(e);
    }
}, 3000);