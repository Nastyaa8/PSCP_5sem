#include <iostream>
#include <string>
#include <winsock2.h>
#include <windows.h>

#pragma comment(lib, "ws2_32.lib")

#define PORT 3000
#define BUFFER_SIZE 1024

int main() {
    
    SetConsoleCP(1251);
    SetConsoleOutputCP(1251);

    WSADATA wsa;
    if (WSAStartup(MAKEWORD(2, 2), &wsa) != 0) {
        std::cerr << "Ошибка инициализации Winsock: " << WSAGetLastError() << std::endl;
        return EXIT_FAILURE;
    }

    SOCKET server_fd, client_fd;
    struct sockaddr_in server_addr, client_addr;
    int client_len = sizeof(client_addr);
    char buffer[BUFFER_SIZE];

    
    server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd == INVALID_SOCKET) {
        std::cerr << "Ошибка создания сокета: " << WSAGetLastError() << std::endl;
        WSACleanup();
        return EXIT_FAILURE;
    }

    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;
    server_addr.sin_port = htons(PORT);

    
    if (bind(server_fd, (struct sockaddr*)&server_addr, sizeof(server_addr)) == SOCKET_ERROR) {
        std::cerr << "Ошибка Bind: " << WSAGetLastError() << std::endl;
        closesocket(server_fd);
        WSACleanup();
        return EXIT_FAILURE;
    }

   
    listen(server_fd, 5);
    std::cout << "Сервер запущен на порту " << PORT << ". Ожидание подключений..." << std::endl;



    while (true) {
        client_fd = accept(server_fd, (struct sockaddr*)&client_addr, &client_len);
        if (client_fd == INVALID_SOCKET) {
            std::cerr << "Ошибка принятия соединения: " << WSAGetLastError() << std::endl;
            continue;
        }

        std::cout << "Клиент подключен!" << std::endl;

        while (true) {
            memset(buffer, 0, BUFFER_SIZE);
            int bytes_received = recv(client_fd, buffer, BUFFER_SIZE - 1, 0); // -1 чтобы оставить место для \0

            if (bytes_received > 0) {
                buffer[bytes_received] = '\0'; // Гарантируем конец строки
                std::cout << "Получено: " << buffer << std::endl;

                std::string response = "ECHO: " + std::string(buffer);
                send(client_fd, response.c_str(), (int)response.length(), 0);
            }
            else if (bytes_received == 0) {
                std::cout << "Клиент отключился." << std::endl;
                break;
            }
            else {
                std::cerr << "Ошибка получения данных: " << WSAGetLastError() << std::endl;
                break;
            }
        }

        closesocket(client_fd);
        std::cout << "Ожидание нового клиента..." << std::endl;
    }

    closesocket(server_fd);
    WSACleanup();
    return 0;
}











