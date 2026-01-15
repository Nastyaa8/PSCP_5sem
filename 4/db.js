const EventEmitter = require('events');

class DB extends EventEmitter {
    constructor() {
        super();
        this.rows = [
            { id: 1, name: 'Vika', bday: '2006-01-10' },
            { id: 2, name: 'Margo', bday: '2006-05-11' }
        ];
        this.nextId = this.rows.length + 1;
    }

    async select() {
        this.emit('GET', this.rows);
        return this.rows;
    }

    async getById(id) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('некорректный id: должно быть положительное число');
        }

        const row = this.rows.find(r => r.id === id);
        if (!row) {
            throw new Error(`запись с id=${id} не найдена`);
        }

        return row;
    }

    async insert(row) {
        const { name, bday } = row;
    
        if (!name || typeof name !== 'string' || name.trim() === '') {
            throw new Error('имя обязательно и не может быть пустым');
        }
    
        if (!bday || !this._isValidDate(bday)) {
            throw new Error('дата рождения обязательна и должна быть в формате гггг-мм-дд');
        }
    
        if (this._isFutureDate(bday)) {
            throw new Error('дата рождения не может быть в будущем');
        }
    
        const newRow = { id: this.nextId++, name: name.trim(), bday };
        this.rows.push(newRow);
        this.emit('POST', newRow);
        return newRow;
    }

    async update(row) {
        const { id, name, bday } = row;

        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('некорректный id: должно быть положительное число для обновления');
        }

        const index = this.rows.findIndex(r => r.id === id);
        if (index === -1) {
            throw new Error(`запись с id=${id} не найдена`);
        }

        if (name !== undefined && name.trim() !== '') {
            this.rows[index].name = name.trim();
        }

        if (bday !== undefined) {
            if (!this._isValidDate(bday)) {
                throw new Error('дата рождения должна быть в формате гггг-мм-дд');
            }
            if (this._isFutureDate(bday)) {
                throw new Error('дата рождения не может быть в будущем');
            }
            this.rows[index].bday = bday;
        }

        this.emit('PUT', this.rows[index]);
        return this.rows[index];
    }

    async delete(id) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('некорректный id: должно быть положительное число для удаления');
        }

        const index = this.rows.findIndex(r => r.id === id);
        if (index === -1) {
            throw new Error(`запись с id=${id} не найдена`);
        }

        const deletedRow = this.rows.splice(index, 1)[0];
        this.emit('DELETE', deletedRow);
        return deletedRow;
    }

    _isValidDate(dateStr) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateStr)) return false;
        const date = new Date(dateStr);
        return !isNaN(date.getTime());
    }

    _isFutureDate(dateStr) {
        const [y, m, d] = dateStr.split('-').map(Number);
        const date = new Date(y, m - 1, d); 
        const today = new Date();
        today.setHours(0,0,0,0); 
        return date > today; 
    }


}

module.exports = DB;
