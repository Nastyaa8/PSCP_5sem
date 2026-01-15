#include <winsock2.h>
#include <ws2tcpip.h>
#include <iostream>
#include <windows.h>

#pragma comment(lib, "ws2_32.lib")

#define SERVER_IP "127.0.0.1"  
#define PORT 3000 
#define BUFFER_SIZE 1024  

int main() {
    
    SetConsoleCP(1251);
    SetConsoleOutputCP(1251);

    WSADATA wsaData;
    SOCKET clientSocket;
    sockaddr_in serverAddr;

    
    char buffer[BUFFER_SIZE];
    const char* message = "Hello from client C++";

    if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
        std::cerr << "Ошибка WSAStartup: " << WSAGetLastError() << std::endl;
        return 1;
    }

    clientSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (clientSocket == INVALID_SOCKET) {
        std::cerr << "Ошибка создания сокета: " << WSAGetLastError() << std::endl;
        WSACleanup();
        return 1;
    }

    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(PORT);
   
    if (inet_pton(AF_INET, SERVER_IP, &serverAddr.sin_addr) <= 0) {
        std::cerr << "Неверный адрес сервера" << std::endl;
        closesocket(clientSocket);
        WSACleanup();
        return 1;
    }

    
    if (connect(clientSocket, (sockaddr*)&serverAddr, sizeof(serverAddr)) == SOCKET_ERROR) {
        std::cerr << "Не удалось подключиться к серверу: " << WSAGetLastError() << std::endl;
        closesocket(clientSocket);
        WSACleanup();
        return 1;
    }

    std::cout << "Подключено к серверу!" << std::endl;

    
    if (send(clientSocket, message, (int)strlen(message), 0) == SOCKET_ERROR) {
        std::cerr << "Ошибка отправки: " << WSAGetLastError() << std::endl;
    }
    else {
        std::cout << "Отправлено: " << message << std::endl;
    }

    
    int bytesReceived = recv(clientSocket, buffer, BUFFER_SIZE - 1, 0);
    if (bytesReceived > 0) {
        buffer[bytesReceived] = '\0'; 
        std::cout << "Ответ от сервера: " << buffer << std::endl;
    }
    else if (bytesReceived == 0) {
        std::cout << "Сервер закрыл соединение." << std::endl;
    }
    else {
        std::cerr << "Ошибка при получении: " << WSAGetLastError() << std::endl;
    }

  
    closesocket(clientSocket);
    WSACleanup();

    
    system("pause");
    return 0;
}