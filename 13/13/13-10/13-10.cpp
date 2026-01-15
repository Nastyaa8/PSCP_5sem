#include <winsock2.h>
#include <ws2tcpip.h>
#include <iostream>
#include <string>
#include <windows.h>

#pragma comment(lib, "ws2_32.lib")

#define SERVER_IP "127.0.0.1"
#define PORT 3000
#define BUFFER_SIZE 1024

int main() {
  
    SetConsoleCP(1251);
    SetConsoleOutputCP(1251);

    WSADATA wsaData;
    SOCKET udpSocket;
    sockaddr_in serverAddr;
    char buffer[BUFFER_SIZE];
    std::string message = "Hello from UDP-client!";

    if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
        std::cerr << "Ошибка WSAStartup: " << WSAGetLastError() << std::endl;
        return 1;
    }

  
    udpSocket = socket(AF_INET, SOCK_DGRAM, 0);
    if (udpSocket == INVALID_SOCKET) {
        std::cerr << "Ошибка создания сокета: " << WSAGetLastError() << std::endl;
        WSACleanup();
        return 1;
    }

   
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(PORT);
    inet_pton(AF_INET, SERVER_IP, &serverAddr.sin_addr);

   
    int sendResult = sendto(udpSocket, message.c_str(), (int)message.length(), 0, (sockaddr*)&serverAddr, sizeof(serverAddr));
    if (sendResult == SOCKET_ERROR) {
        std::cerr << "Ошибка отправки: " << WSAGetLastError() << std::endl;
    }
    else {
        std::cout << "Отправлено серверу: " << message << std::endl;
    }

   
    sockaddr_in fromAddr;
    int fromAddrSize = sizeof(fromAddr);

   
    int bytesReceived = recvfrom(udpSocket, buffer, BUFFER_SIZE - 1, 0, (sockaddr*)&fromAddr, &fromAddrSize);

    if (bytesReceived != SOCKET_ERROR) {
        buffer[bytesReceived] = '\0';
        std::cout << "Ответ сервера: " << buffer << std::endl;
    }
    else {
        std::cerr << "Ошибка получения: " << WSAGetLastError() << std::endl;
    }


    closesocket(udpSocket);
    WSACleanup();

    system("pause"); // Чтобы успеть увидеть результат
    return 0;
}