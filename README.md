# POC-README

# **POC: Realtime communication for Recornect system**

Welcome to the POC (Proof of Concept) repository for Realtime communication for Recornect system. This repository contains prototypes for implementing realtime communication using both SignalR and MQTT protocols. There are two main components included in this repository:

- **Client:** This directory contains the client-side applications.
    - **`dotnet-console-mqtt`**: A .NET console application acting as an MQTT client.
    - **`reactjs`**: A ReactJS web application built with Vite and Typescript, capable of demonstrating both SignalR and MQTT communication.
- **Server:** This directory contains the server-side applications.
    - **`mqtt`**: An ASP.NET project serving as an MQTT broker.
    - **`signalr`**: An ASP.NET project for the SignalR server.

## **Getting Started**

To get started with running the server and client projects, follow the instructions below.

### **Running the Server**

1. **Navigate to the Server directory:**
    
    ```bash
    cd server
    ```
    
2. **Install Dependencies:**
    
    For both MQTT and SignalR servers, you'll need to install the necessary dependencies. Navigate to each respective server folder (**`mqtt`** or **`signalr`**) and install dependencies.
    
    ```bash
    cd mqtt
    dotnet restore
    ```
    
    ```bash
    cd signalr
    dotnet restore
    ```
    
3. **Run the Servers:**
    
    Once dependencies are installed, you can run the servers. Start the MQTT and SignalR servers by running the following commands within their respective folders:
    
    ```bash
    dotnet run
    ```
    
    Make sure both servers are running successfully before proceeding to run the client.
    

### **Running the Client**

1. **Navigate to the Client directory:**
    
    ```bash
    cd client
    ```
    
2. **Install Dependencies:**
    
    Navigate to the **`reactjs`** folder and install the necessary dependencies:
    
    ```bash
    cd reactjs
    npm install
    ```
    
    or using Yarn:
    
    ```bash
    yarn install
    ```
    
3. **Run the Client Application:**
    
    After installing dependencies, you can start the ReactJS application:
    
    ```bash
    npm run dev
    ```
    
    or using Yarn:
    
    ```bash
    yarn dev
    ```
    
    This command will launch the application, and you should be able to access it via your web browser.
    
4. **Play with the demo**
    - When the web is on, you can choose to try signalR or MQTT server simply by click on their tabs
    - You can create multiple client to use
    - With signalR client. You have to enter your username and the room name. You can select the room you have joined to send or view messages
    - With MQTT client. The UI present processes in MQTT model: *connect*, *publish*, *subscribe* and *receive*. Remember to subscribe at least one topic for a client to receive the messages

### **Running the .NET console MQTT Client (dotnet-console-mqtt)**

1. **Navigate to the Client directory:**
    
    ```bash
    cd client
    ```
    
2. **Navigate to the `dotnet-console-mqtt` folder:**
    
    ```bash
    cd dotnet-console-mqtt
    ```
    
3. **Install Dependencies:**
    
    Since this is a .NET console application, you don't need to install any additional dependencies.
    
4. **Run the Application:**
    
    Execute the following command to run the MQTT client:
    
    ```bash
    dotnet run
    ```
    
    This command will compile and execute the MQTT client application.
    

## **Note:**

Ensure that the MQTT server (from the **`server/mqtt`** directory) is running before executing the MQTT client application. The client application will connect to the MQTT broker hosted by the server to send and receive messages.

## **Issues**

If you encounter any issues or have suggestions for improvements, please feel free to open an issue on this repository. We appreciate your feedback!