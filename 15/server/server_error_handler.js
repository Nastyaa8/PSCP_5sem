function ServerErrorHandler() {
    this.handler = (res, errorCode, errorMessage) => {
        try {
            // Если заголовки уже отправлены, логируем ошибку и выходим
            if (res.headersSent) {
                console.error('Headers already sent. Error:', errorMessage);
                return;
            }

            // Формируем объект ответа с ошибкой
            const errorResponse = {
                errorCode: errorCode,
                errorMessage: errorMessage,
                timestamp: new Date().toISOString()
            };

            // Отправляем ответ с ошибкой
            res.writeHead(errorCode, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(errorResponse, null, 4));
        } catch (err) {
            // Если произошла ошибка при отправке ответа, логируем её
            console.error('Error in error handler:', err);
        }
    }
}

module.exports = () => new ServerErrorHandler();