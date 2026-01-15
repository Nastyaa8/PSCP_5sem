#include <winsock2.h>
#include <ws2tcpip.h>
#include <iostream>
#include <string>
#include <windows.h>

#pragma comment(lib, "ws2_32.lib")

#define PORT 3000
#define BUFFER_SIZE 1024

int main() {
    
    SetConsoleCP(1251);
    SetConsoleOutputCP(1251);

    WSADATA wsaData;
    SOCKET udpSocket;
    sockaddr_in serverAddr, clientAddr;
    char buffer[BUFFER_SIZE];

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
    serverAddr.sin_addr.s_addr = INADDR_ANY;
    serverAddr.sin_port = htons(PORT);

    if (bind(udpSocket, (sockaddr*)&serverAddr, sizeof(serverAddr)) == SOCKET_ERROR) {
        std::cerr << "Ошибка bind: " << WSAGetLastError() << std::endl;
        closesocket(udpSocket);
        WSACleanup();
        return 1;
    }

    std::cout << "UDP-сервер (13-09) запущен на порту " << PORT << std::endl;

    while (true) {
        int clientAddrSize = sizeof(clientAddr);

       
        int bytesReceived = recvfrom(udpSocket, buffer, BUFFER_SIZE - 1, 0, (sockaddr*)&clientAddr, &clientAddrSize);

        if (bytesReceived == SOCKET_ERROR) {
            std::cerr << "Ошибка recvfrom: " << WSAGetLastError() << std::endl;
            continue;
        }

        buffer[bytesReceived] = '\0';
        std::cout << "Получено сообщение: " << buffer << std::endl;

       
        std::string response = "ECHO: " + std::string(buffer);

       
        sendto(udpSocket, response.c_str(), (int)response.size(), 0, (sockaddr*)&clientAddr, clientAddrSize);
    }

    closesocket(udpSocket);
    WSACleanup();
    return 0;
}