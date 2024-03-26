
using MaterialDesignThemes.Wpf;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.PortableExecutable;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Media.Media3D;
using System.Windows.Navigation;
using System.Windows.Shapes;
using uPLibrary.Networking.M2Mqtt;
using uPLibrary.Networking.M2Mqtt.Messages;

namespace WPFClient.Views
{
    public partial class MQTT : UserControl
    {
        MqttClient mqttClient;

        // List of total messages that this user has received of all rooms
        List<Message> totalMessages = new List<Message>();

        // List of messages that this user has received of the selected room
        List<Message> messages = new List<Message>();
        public MQTT()
        {
            InitializeComponent();

        }

        private async void connectButton_Click(object sender, RoutedEventArgs e)
        {
            // Visible the ChatServicePart 
            ChatServicePart.Visibility = Visibility.Visible;

            mqttClient = new MqttClient("localhost");
            // Subscribe to the MqttMsgPublishReceived event
            mqttClient.MqttMsgPublishReceived += MqttClient_MqttMsgPublishReceived;

            string clientId = clientIDInput.Text;
            string userName = userNameInput.Text;
            string password = passwordInput.Text;

            await Task.Run(() => mqttClient.Connect(clientId, userName, password));

            if (mqttClient.IsConnected)
            {
                clientIDInput.IsReadOnly = true;
                clientIDInput.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FFD9D9D9"));
                userNameInput.IsReadOnly = true;
                userNameInput.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FFD9D9D9"));
                passwordInput.IsReadOnly = true;
                passwordInput.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FFD9D9D9"));

                connectButton.IsEnabled = false;
                disconnectButton.IsEnabled = true;
            }
            else
            {
                MessageBox.Show("Not connected to the broker");
            }
        }

        private async void disconnectButton_Click(object sender, RoutedEventArgs e)
        {
            ChatServicePart.Visibility = Visibility.Collapsed;

            clientIDInput.IsReadOnly = false;
            clientIDInput.Background = Brushes.Transparent;
            userNameInput.IsReadOnly = false;
            userNameInput.Background = Brushes.Transparent;
            passwordInput.IsReadOnly = false;
            passwordInput.Background = Brushes.Transparent;

            connectButton.IsEnabled = true;
            disconnectButton.IsEnabled = false;

            topicPublishInput.Text = "";
            qosPublishCbb.SelectedIndex = 0;
            retainMsgCbx.IsChecked = false;

            topicSubsInput.Text = "";
            qosSubsCbb.SelectedIndex = 0;
            payloadInput.Text = "";
            receptionsPart.Visibility = Visibility.Collapsed;
            noneSubsData.Visibility = Visibility.Visible;
            roomList.Children.Clear();

            // Clear all the children except noneSubsData in roomList parent
            for (int i = roomList.Children.Count - 1; i >= 0; i--)
            {
                // Check if the child is a Border
                if (roomList.Children[i] is Card card)
                {
                    // Check if the x:Name of the Border is "noneSubsData"
                    if (card.Name != "noneSubsData")
                    {
                        // Remove the child
                        roomList.Children.RemoveAt(i);
                    }
                }
            }

            await Task.Run(() => mqttClient.Disconnect());
        }

        private void subsButton_Click(object sender, RoutedEventArgs e)
        {
            string topic = topicSubsInput.Text;

            //qos I use combobox for choose the level of qos
            byte qos = byte.Parse(((ComboBoxItem)qosSubsCbb.SelectedItem).Content.ToString());

            Dispatcher.Invoke(() =>
            {
                int count = 0;
                // Check if the room name already exists
                foreach (Button button in roomList.Children.OfType<Button>())
                {
                    if (button.Content.ToString() == topic)
                    {
                        count++;
                    }
                }

                if (count == 0)
                {
                    // Clear the nonReceptionsData material card
                    for (int i = roomList.Children.Count - 1; i >= 0; i--)
                    {
                        // Check if the child is a Border
                        if (roomList.Children[i] is Card card)
                        {
                            // Check if the x:Name of the Border is "nonReceptionsData"
                            if (card.Name == "noneSubsData")
                            {
                                // Trans visibility to Collapsed
                                card.Visibility = Visibility.Collapsed;
                            }
                        }
                    }

                    // Create a new TextBlock
                    TextBlock textBlock = new TextBlock();

                    // Add a run for the topic
                    Run topicRun = new Run
                    {
                        Text = $"{topic}- ",
                        FontWeight = FontWeights.Bold,
                        FontSize = 16
                    };
                    textBlock.Inlines.Add(topicRun);

                    // Add a Run for the qos
                    Run qosRun = new Run
                    {
                        Text = $"qos:{qos}"
                    };
                    textBlock.Inlines.Add(qosRun);

                    // Create a new Button
                    Button newButton = new Button();
                    newButton.Content = textBlock;
                    newButton.FontWeight = FontWeights.Normal;
                    newButton.Click += RoomItem_Click;
                    newButton.FontSize = 14;
                    newButton.Background = Brushes.Transparent;
                    newButton.BorderBrush = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FF373737"));
                    newButton.Foreground = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#DD000000"));
                    newButton.Width = 240;
                    newButton.VerticalContentAlignment = VerticalAlignment.Center;
                    newButton.BorderThickness = new Thickness(0.4);
                    roomList.Children.Add(newButton);
                }
            });
        }

        private void MqttClient_MqttMsgPublishReceived(object sender, MqttMsgPublishEventArgs e)
        {
            // The message is available in e.Message
            // The topic is available in e.Topic
            string message = Encoding.UTF8.GetString(e.Message);
            string topic = e.Topic;
            string qos = e.QosLevel.ToString();

            // Create a new Border
            Dispatcher.Invoke(() =>
            {

                // Create a new Message object
                Message newMessage = new Message
                {
                    Room = topic,
                    MessageText = message,
                    Status = true,
                    Qos = qos
                    // Set this to the actual status
                };

                // Add the new Message to the totalMessages list
                totalMessages.Add(newMessage);

                messageComponent_Change();
            });
        }

        private void messageComponent_Change()
        {
            Dispatcher.Invoke(() =>
            {
                messageRoom.Children.Clear();

                string extractedButtonContent = topicName.Text.Substring("Topic: ".Length);

                // Check if the room is selected
                messages = totalMessages.Where(m => m.Room == extractedButtonContent).ToList();

                foreach (Message message in messages)
                {
                    //Create new message component
                    Border border = new Border
                    {
                        Width = 230,
                        BorderBrush = new SolidColorBrush(Color.FromRgb(0xCB, 0xCB, 0xCB)),
                        BorderThickness = new Thickness(1),
                        Margin = new Thickness(0, 0, 0, 10)
                    };

                    // Create a new StackPanel
                    StackPanel stackPanel = new StackPanel();

                    // Create a new TextBlock for the topic
                    TextBlock topicTextBlock = new TextBlock
                    {
                        Text = $"{message.Room}-qos:{message.Qos}",
                        Padding = new Thickness(10),
                        FontWeight = FontWeights.Bold
                    };

                    // Create a new TextBlock for the message
                    TextBlock messageTextBlock = new TextBlock
                    {
                        Text = message.MessageText,
                        Padding = new Thickness(10)
                    };

                    // Add the TextBlocks to the StackPanel
                    stackPanel.Children.Add(topicTextBlock);
                    stackPanel.Children.Add(messageTextBlock);

                    // Add the StackPanel to the Border
                    border.Child = stackPanel;

                    // Add the Border to the messageRoom StackPanel
                    messageRoom.Children.Add(border);
                }
            });
        }

        private async void publishButton_Click(object sender, RoutedEventArgs e)
        {
            string topic = topicPublishInput.Text;
            byte qos = byte.Parse(((ComboBoxItem)qosPublishCbb.SelectedItem).Content.ToString());
            string payload = payloadInput.Text;
            bool retained = retainMsgCbx.IsChecked.Value;

            if (mqttClient.IsConnected)
            {
                await Task.Run(() => mqttClient.Publish(topic, Encoding.UTF8.GetBytes(payload), qos, retained));
            }
            else
            {
                MessageBox.Show("Not connected to the broker");
            }
        }

        private async void RoomItem_Click(object sender, RoutedEventArgs e)
        {
            Task.Factory.StartNew(() => messageComponent_Change(), TaskCreationOptions.LongRunning);

            // Visible the receptionsPart
            receptionsPart.Visibility = Visibility.Visible;

            Button button = (Button)sender;

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

                Run qosRun = (Run)((TextBlock)button.Content).Inlines.ElementAt(1);
                Run topicRun = (Run)((TextBlock)button.Content).Inlines.ElementAt(0);

                string qos = qosRun.Text.Split(':')[1].Trim();
                string buttonContent = topicRun.Text;

                byte qosValue = byte.Parse(qos);

                topicName.Text = $"Topic: {buttonContent.Split('-')[0].Trim()}";
                userName.Text = $"UserName: {userNameInput.Text}";

                if (mqttClient.IsConnected)
                {
                    mqttClient.Subscribe(new string[] { buttonContent.Split('-')[0].Trim() }, new byte[] { qosValue });
                }
                else
                {
                    MessageBox.Show("Not connected to the broker");
                }
            }
        }
    }
}
