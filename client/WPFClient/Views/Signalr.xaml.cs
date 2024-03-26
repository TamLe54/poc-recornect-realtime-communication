using Microsoft.AspNetCore.SignalR.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace WPFClient.Views
{
    /// <summary>
    /// Interaction logic for Signalr.xaml
    /// </summary>
    public partial class Signalr : UserControl
    {
        // HubConnection instance
        HubConnection connection;

        // List of total messages that this user has received of all rooms
        List<Message> totalMessages = new List<Message>();

        // List of messages that this user has received of the selected room
        List<Message> messages = new List<Message>();
        public Signalr()
        {
            InitializeComponent();

            // Create a new instance of HubConnection
            connection = new HubConnectionBuilder()
                .WithUrl("http://localhost:5023/chathub")
                .WithAutomaticReconnect()
                .Build();

            // Handle the "ReceiveMessage" event from the server
            connection.On<string, string, string, bool>("ReceiveMessage", (user, message, receivedRoom, status) =>
            {
                try
                {
                    // Update the UI on the main thread
                    Application.Current.Dispatcher.Invoke(() =>
                    {
                        // Create a new Message object
                        var newMessage = new Message
                        {
                            User = user,
                            Room = receivedRoom,
                            MessageText = message,
                            Status = status,
                        };
                        // Add the new message to the totalMessages list
                        totalMessages.Add(newMessage);

                        // Update the message component for viewing the detail;
                        messageComponent_Change(Header.Children.OfType<Label>().First().Content.ToString());

                        // Print the message details to the console
                        Console.WriteLine("-------------MESSAGE-WPFCLIENT------------");
                        Console.WriteLine($"User send the message: {newMessage.User}");
                        Console.WriteLine($"Room: {newMessage.Room}");
                        Console.WriteLine($"Message: {newMessage.MessageText}");
                        Console.WriteLine($"Status: {newMessage.Status}");
                        Console.WriteLine("-------------------------------------");
                    });
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                }
            });

            // Handle the "Reconnecting" event
            connection.Reconnecting += async (sender) =>
            {
                this.Dispatcher.Invoke(() =>
                {
                    Console.WriteLine("Attempting to reconnect...");
                });

                await Task.CompletedTask;
            };

            // Handle the "Reconnected" event
            connection.Reconnected += async (sender) =>
            {
                this.Dispatcher.Invoke(() =>
                {
                    Console.WriteLine("Reconnected to the server");
                });

                await Task.CompletedTask;
            };
        }

        // Handle the "OpenConnection" button click event
        private async void OpenConnection_Click(object sender, RoutedEventArgs e)
        {
            if (chatServicePart.Visibility == Visibility.Collapsed)
            {
                try
                {
                    // Start the connection to the server
                    await connection.StartAsync();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Connection failed!:{ex.Message}");
                    MessageBox.Show("Connection failed!");
                }

                // Handle UI Event for Connection
                // Check if the user has connected to the server
                if (connection.State == HubConnectionState.Connected)
                {
                    userInput.IsReadOnly = true;

                    userInput.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FFD9D9D9"));
                    connectButton.Content = "Disconnect";
                    chatServicePart.Visibility = Visibility.Visible;
                    userName.Content = userInput.Text;

                    Console.WriteLine("--------WPFCLIENT-CONNECTION-NOTIFICATION--------");
                    Console.WriteLine($"{userInput.Text} have connected to Server");
                    Console.WriteLine("--------------------------------");
                }
            }
            else
            {
                connectButton.Content = "Connect";
                userInput.IsReadOnly = false;
                userInput.Background = Brushes.Transparent;
                roomList.Children.Clear();
                totalMessages.Clear();
                messages.Clear();
                Header.Children.OfType<Label>().First().Content = "";
                chatServicePart.Visibility = Visibility.Collapsed;

                // Stop the connection to the server
                await connection.StopAsync();
            }
        }

        // Handle the "AddRoom" button click event
        private void AddRoom_Click(object sender, RoutedEventArgs e)
        {
            noneDataCard.Visibility = Visibility.Collapsed;

            int count = 0;

            // Check if the room name already exists
            foreach (Button button in roomList.Children.OfType<Button>())
            {
                if (button.Content.ToString() == roomInput.Text)
                {
                    count++;
                }
            }

            if (count == 0)
            {
                string roomName = roomInput.Text;
                Button newButton = new Button();
                newButton.Content = roomName;
                newButton.FontWeight = FontWeights.Normal;
                newButton.Click += RoomItem_Click;
                newButton.FontSize = 14;
                newButton.Background = Brushes.Transparent;
                newButton.BorderBrush = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FF373737"));
                newButton.Foreground = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#DD000000"));
                newButton.Margin = new Thickness(0, 0, 10, 0);
                newButton.Width = 234;
                newButton.VerticalContentAlignment = VerticalAlignment.Center;
                newButton.BorderThickness = new Thickness(0.4);
                roomList.Children.Add(newButton);
                // After adding the room, reset the room input
                roomInput.Text = "";
            }
            else
            {
                MessageBox.Show("Room name already exists");
            }
        }

        // Handle the "RoomItem" button click event
        private async void RoomItem_Click(object sender, RoutedEventArgs e)
        {
            Button button = (Button)sender;

            messagePart.Visibility = Visibility.Visible;

            if (button.BorderBrush.ToString() == "#FF373737")
            {
                // Handle UI Event for Room Item
                foreach (Button otherButton in roomList.Children.OfType<Button>())
                {
                    if (otherButton != button)
                    {
                        otherButton.BorderBrush = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FF373737"));
                        otherButton.BorderThickness = new Thickness(0.4);
                    }
                }

                button.BorderBrush = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FF5A7C5A"));
                button.BorderThickness = new Thickness(2);

                Header.Children.OfType<Label>().First().Content = button.Content;

                // Filter the messages based on the selected room
                bool status = true;

                if (totalMessages.Where(m => m.Room == button.Content.ToString() && m.MessageText == "Has Joined the Group").ToList().Count >= 0)
                {
                    status = false;
                }

                // Invoke the "JoinRoom" method on the server
                await connection.InvokeAsync("JoinRoom", new UserRoomConnection
                {
                    User = userInput.Text,
                    Room = button.Content.ToString()
                }, status);
            }
        }

        // Update the message component based on the selected room
        private void messageComponent_Change(string room)
        {
            // After changing the room or sending new message, reset the message input
            messageRoom.Children.Clear();

            // Filter the messages based on the selected room and status
            messages = totalMessages.Where(m => m.Room == room && m.Status == true).ToList();

            foreach (Message message in messages)
            {
                var messagePanel = new StackPanel
                {
                    HorizontalAlignment = HorizontalAlignment.Left,
                    Margin = new Thickness(10),
                };

                var messageBorder = new Border
                {
                    HorizontalAlignment = HorizontalAlignment.Left,
                    BorderBrush = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FFCBCBCB")),
                    BorderThickness = new Thickness(1),
                    CornerRadius = new CornerRadius(5),
                    Margin = new Thickness(20, 10, 20, 10),
                };

                var messageGrid = new Grid();
                messageGrid.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto });
                messageGrid.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto });

                var userTextBlock = new TextBlock
                {
                    Text = message.User,
                    FontWeight = FontWeights.Bold,
                    Padding = new Thickness(10),
                };
                Grid.SetRow(userTextBlock, 0);

                var messageTextBlock = new TextBlock
                {
                    Text = message.MessageText,
                    Padding = new Thickness(10),
                    FontSize = 13,
                };
                Grid.SetRow(messageTextBlock, 1);

                var separatorBorder = new Border
                {
                    BorderBrush = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FFCBCBCB")),
                    BorderThickness = new Thickness(0, 0, 0, 1),
                };
                Grid.SetRow(separatorBorder, 0);

                messageGrid.Children.Add(userTextBlock);
                messageGrid.Children.Add(separatorBorder);
                messageGrid.Children.Add(messageTextBlock);

                messageBorder.Child = messageGrid;

                if (message.User == userInput.Text)
                {
                    messagePanel.HorizontalAlignment = HorizontalAlignment.Right;
                }
                else if (message.User == "JoinRoomNotification")
                {
                    messagePanel.HorizontalAlignment = HorizontalAlignment.Center;
                }

                messagePanel.Children.Add(messageBorder);
                messageRoom.Children.Add(messagePanel);
            }

        }

        // Handle the "sendMessageButton" click event
        private void sendMessageButton_Click(object sender, RoutedEventArgs e)
        {
            // Invoke the "SendMessage" method on the server
            bool status = true;

            connection.InvokeAsync("SendMessage", messageInput.Text, Header.Children.OfType<Label>().First().Content.ToString(), status);

            // After send the message, reset message input
            messageInput.Text = "";

            Console.WriteLine();
        }
    }
}
