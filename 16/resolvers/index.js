// Вспомогательная функция для Query
async function getRecordsByField(object, field, context) {
    let records = [];
    if (field) {
        records = await context.getOne(object, object, field);
    } else {
        records = await context.getAll(object);
    }

   
    return records.map(record => {
        if (object === 'FACULTY') {
            return { FACULTY: record.FACULTY, FACULTY_NAME: record.FACULTY_NAME };
        } else if (object === 'PULPIT') {
            return { PULPIT: record.PULPIT, PULPIT_NAME: record.PULPIT_NAME, FACULTY: record.FACULTY };
        } else if (object === 'SUBJECT') {
            return { SUBJECT: record.SUBJECT, SUBJECT_NAME: record.SUBJECT_NAME, PULPIT: record.PULPIT };
        } else if (object === 'TEACHER') {
            return { TEACHER: record.TEACHER, TEACHER_NAME: record.TEACHER_NAME, PULPIT: record.PULPIT };
        }
        return record; 
    });
}

// Вспомогательная функция для Mutation (Set)
async function mutateRecord(object, idField, fields, context) {

    return await context.upsert(object, idField, fields);
}

// Вспомогательная функция для Mutation (Delete)
async function deleteRecord(object, id, context) {
    return await context.delete(object, object, id);
}

module.exports = {
    // --- QUERIES ---
    getFaculties: (args, context) => getRecordsByField('FACULTY', args.FACULTY, context),
    getPulpits: (args, context) => getRecordsByField('PULPIT', args.PULPIT, context),
    getSubjects:  (args, context) => getRecordsByField('SUBJECT', args.SUBJECT, context),
    getTeachers: (args, context) => getRecordsByField('TEACHER', args.TEACHER, context),
    
    getSubjectsByFaculties: async (args, context) => {
        if (args.FACULTY) return await context.getSubjectsByFaculties(args.FACULTY);
        return await getRecordsByField('SUBJECT', null, context);
    },
    
    getTeachersByFaculty: async (args, context) => {
        if (args.FACULTY) {

            const pool = await context.getAll('TEACHER');
           
            return []; 
        }
        return await getRecordsByField('TEACHER', null, context);
    },

    // --- MUTATIONS (SET) ---

    setFaculty: (args, context) => {
        return mutateRecord('FACULTY', 'FACULTY', { FACULTY: args.FACULTY, FACULTY_NAME: args.FACULTY_NAME }, context);
    },
    setPulpit: (args, context) => {
        return mutateRecord('PULPIT', 'PULPIT', { PULPIT: args.PULPIT, PULPIT_NAME: args.PULPIT_NAME, FACULTY: args.FACULTY }, context);
    },
    setSubject: (args, context) => {
        return mutateRecord('SUBJECT', 'SUBJECT', { SUBJECT: args.SUBJECT, SUBJECT_NAME: args.SUBJECT_NAME, PULPIT: args.PULPIT }, context);
    },
    setTeacher: (args, context) => {
        return mutateRecord('TEACHER', 'TEACHER', { TEACHER: args.TEACHER, TEACHER_NAME: args.TEACHER_NAME, PULPIT: args.PULPIT }, context);
    },

    // --- MUTATIONS (DELETE) ---
    delFaculty: (args, context) => deleteRecord('FACULTY', args.FACULTY, context),
    delPulpit: (args, context) => deleteRecord('PULPIT', args.PULPIT, context),
    delSubject: (args, context) => deleteRecord('SUBJECT', args.SUBJECT, context),
    delTeacher: (args, context) => deleteRecord('TEACHER', args.TEACHER, context)
};