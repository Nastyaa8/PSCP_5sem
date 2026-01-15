const express = require('express');
const sql = require('mssql'); //tedious TDS
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;


const config = {
    user: 'student',       
    password: 'fitfit',    
    server: 'localhost', 
    database: 'SAA',  
    port: 1433,          
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

async function connectDB() {
    try {
        await sql.connect(config);
        console.log('Connected to MSSQL');
    } catch (err) {
        console.error('Database connection error:', err);
    }
}
connectDB();

app.use(bodyParser.json());

app.use(express.static(__dirname)); 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ==========================================
// 1. FACULTIES (Факультеты)
// ==========================================

app.get('/api/faculties', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM FACULTY');
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка получения факультетов' });
    }
});

app.post('/api/faculties', async (req, res) => {
    const { FACULTY, FACULTY_NAME } = req.body; // Ждем ключи заглавными, как в БД
    try {
        await sql.query`
            INSERT INTO FACULTY (FACULTY, FACULTY_NAME)
            VALUES (${FACULTY}, ${FACULTY_NAME})
        `;
        res.json(req.body);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка добавления факультета' });
    }
});

app.put('/api/faculties', async (req, res) => {
    const { FACULTY, FACULTY_NAME } = req.body;
    try {
        const result = await sql.query`
            UPDATE FACULTY 
            SET FACULTY_NAME = ${FACULTY_NAME} 
            WHERE FACULTY = ${FACULTY}
        `;
        if (result.rowsAffected[0] === 0) return res.status(404).json({ error: 'Факультет не найден' });
        res.json(req.body);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка обновления факультета' });
    }
});

app.delete('/api/faculties/:id', async (req, res) => {
    try {
        const result = await sql.query`DELETE FROM FACULTY WHERE FACULTY = ${req.params.id}`;
        if (result.rowsAffected[0] === 0) return res.status(404).json({ error: 'Факультет не найден' });
        res.json({ message: 'Факультет удалён' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка удаления (возможно, есть связанные кафедры)' });
    }
});


// ==========================================
// 2. PULPITS (Кафедры)
// ==========================================

app.get('/api/pulpits', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM PULPIT');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения кафедр' });
    }
});

app.post('/api/pulpits', async (req, res) => {
    const { PULPIT, PULPIT_NAME, FACULTY } = req.body;
    console.log('Добавление кафедры:', req.body);
    try {
        await sql.query`
            INSERT INTO PULPIT (PULPIT, PULPIT_NAME, FACULTY)
            VALUES (${PULPIT}, ${PULPIT_NAME}, ${FACULTY})
        `;
        res.json(req.body);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка добавления кафедры (проверьте код факультета)' });
    }
});

app.put('/api/pulpits', async (req, res) => {
    const { PULPIT, PULPIT_NAME, FACULTY } = req.body;
    try {
        const result = await sql.query`
            UPDATE PULPIT
            SET PULPIT_NAME = ${PULPIT_NAME}, FACULTY = ${FACULTY}
            WHERE PULPIT = ${PULPIT}
        `;
        if (result.rowsAffected[0] === 0) return res.status(404).json({ error: 'Кафедра не найдена' });
        res.json(req.body);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка обновления кафедры' });
    }
});

app.delete('/api/pulpits/:id', async (req, res) => {
    try {
        const result = await sql.query`DELETE FROM PULPIT WHERE PULPIT = ${req.params.id}`;
        if (result.rowsAffected[0] === 0) return res.status(404).json({ error: 'Кафедра не найдена' });
        res.json({ message: 'Кафедра удалена' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка удаления (есть связанные предметы/преподаватели)' });
    }
});


// ==========================================
// 3. SUBJECTS (Дисциплины)
// ==========================================

app.get('/api/subjects', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM SUBJECT');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения дисциплин' });
    }
});

app.post('/api/subjects', async (req, res) => {
    const { SUBJECT, SUBJECT_NAME, PULPIT } = req.body;
    try {
        await sql.query`
            INSERT INTO SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT) 
            VALUES (${SUBJECT}, ${SUBJECT_NAME}, ${PULPIT})
        `;
        res.json(req.body);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка добавления дисциплины' });
    }
});

app.put('/api/subjects', async (req, res) => {
    const { SUBJECT, SUBJECT_NAME, PULPIT } = req.body;
    try {
        const result = await sql.query`
            UPDATE SUBJECT 
            SET SUBJECT_NAME = ${SUBJECT_NAME}, PULPIT = ${PULPIT}
            WHERE SUBJECT = ${SUBJECT}
        `;
        if (result.rowsAffected[0] === 0) return res.status(404).json({ error: 'Дисциплина не найдена' });
        res.json(req.body);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка обновления дисциплины' });
    }
});

app.delete('/api/subjects/:id', async (req, res) => {
    try {
        const result = await sql.query`DELETE FROM SUBJECT WHERE SUBJECT = ${req.params.id}`;
        if (result.rowsAffected[0] === 0) return res.status(404).json({ error: 'Дисциплина не найдена' });
        res.json({ message: 'Дисциплина удалена' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка удаления' });
    }
});


// ==========================================
// 4. AUDITORIUM_TYPES (Типы аудиторий)
// ==========================================

app.get('/api/auditoriumstypes', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM AUDITORIUM_TYPE');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения типов аудиторий' });
    }
});

app.post('/api/auditoriumstypes', async (req, res) => {
    const { AUDITORIUM_TYPE, AUDITORIUM_TYPENAME } = req.body;
    try {
        await sql.query`
            INSERT INTO AUDITORIUM_TYPE (AUDITORIUM_TYPE, AUDITORIUM_TYPENAME) 
            VALUES (${AUDITORIUM_TYPE}, ${AUDITORIUM_TYPENAME})
        `;
        res.json(req.body);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка добавления типа' });
    }
});

app.put('/api/auditoriumstypes', async (req, res) => {
    const { AUDITORIUM_TYPE, AUDITORIUM_TYPENAME } = req.body;
    try {
        const result = await sql.query`
            UPDATE AUDITORIUM_TYPE 
            SET AUDITORIUM_TYPENAME = ${AUDITORIUM_TYPENAME}
            WHERE AUDITORIUM_TYPE = ${AUDITORIUM_TYPE}
        `;
        if (result.rowsAffected[0] === 0) return res.status(404).json({ error: 'Тип не найден' });
        res.json(req.body);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка обновления' });
    }
});

app.delete('/api/auditoriumtypes/:id', async (req, res) => {
    try {
        // Сначала удаляем аудитории этого типа (иначе SQL не даст удалить тип)
        await sql.query`DELETE FROM AUDITORIUM WHERE AUDITORIUM_TYPE = ${req.params.id}`;
        // Удаляем сам тип
        const result = await sql.query`DELETE FROM AUDITORIUM_TYPE WHERE AUDITORIUM_TYPE = ${req.params.id}`;
        
        if (result.rowsAffected[0] === 0) return res.status(404).json({ error: 'Тип не найден' });
        res.json({ message: 'Тип аудитории и связанные аудитории удалены' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка удаления' });
    }
});


// ==========================================
// 5. AUDITORIUMS (Аудитории)
// ==========================================

app.get('/api/auditoriums', async (req, res) => { 
    try {
        const result = await sql.query('SELECT * FROM AUDITORIUM');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения аудиторий' });
    }
});

app.post('/api/auditoriums', async (req, res) => {
    const { AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_CAPACITY, AUDITORIUM_TYPE } = req.body;
    try {
        await sql.query`
            INSERT INTO AUDITORIUM (AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_CAPACITY, AUDITORIUM_TYPE) 
            VALUES (${AUDITORIUM}, ${AUDITORIUM_NAME}, ${AUDITORIUM_CAPACITY}, ${AUDITORIUM_TYPE})
        `;
        res.json(req.body);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка добавления аудитории' });
    }
});

app.put('/auditoriums', async (req, res) => { 
    const { AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_CAPACITY, AUDITORIUM_TYPE } = req.body;
    try {
        const result = await sql.query`
            UPDATE AUDITORIUM 
            SET AUDITORIUM_NAME = ${AUDITORIUM_NAME}, AUDITORIUM_CAPACITY = ${AUDITORIUM_CAPACITY}, AUDITORIUM_TYPE = ${AUDITORIUM_TYPE}
            WHERE AUDITORIUM = ${AUDITORIUM}
        `;
        if (result.rowsAffected[0] === 0) return res.status(404).json({ error: 'Аудитория не найдена' });
        res.json(req.body);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка обновления аудитории' });
    }
});

app.delete('/api/auditoriums/:id', async (req, res) => {
    try {
        const result = await sql.query`DELETE FROM AUDITORIUM WHERE AUDITORIUM = ${req.params.id}`;
        if (result.rowsAffected[0] === 0) return res.status(404).json({ error: 'Аудитория не найдена' });
        res.json({ message: 'Аудитория удалена' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка удаления' });
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});