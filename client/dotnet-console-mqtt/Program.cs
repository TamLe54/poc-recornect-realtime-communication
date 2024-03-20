using System.Text;
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Protocol;

class Program
{
    static async Task Main(string[] args) 
    {
        // string broker = "pee169de.ala.asia-southeast1.emqxsl.com";
        string broker = "127.0.0.1";
        int port = 1883;
        string clientId = Guid.NewGuid().ToString();
        
        const string topicDefault = "public";
        const string usernameDefault = "tamle";
        const string passwordDefault = "123123";

        string? topic;
        string? username;
        string? password;

        Console.WriteLine("Enter your username: ");
        username = Console.ReadLine();

        Console.WriteLine("Enter your password: ");
        password = Console.ReadLine();

        Console.WriteLine("Enter topic you want to subscribe: ");
        topic = Console.ReadLine();

        username = string.IsNullOrWhiteSpace(username) ? usernameDefault : username;
        password = string.IsNullOrWhiteSpace(password) ? passwordDefault : password;
        topic = string.IsNullOrWhiteSpace(topic) ? topicDefault : topic;

        var mqttFactory = new MqttFactory();

        using (var mqttClient = mqttFactory.CreateMqttClient())
        {
            var mqttClientOptions = new MqttClientOptionsBuilder()
            .WithClientId(clientId)
            .WithTcpServer(broker, port)
            // .WithCredentials(username, password)
            // .WithTlsOptions(o => {

            // })
            .Build();

            // Setup message handling before connecting so that queued messages
            // are also handled properly. When there is no event handler attached all
            // received messages get lost.
            mqttClient.ApplicationMessageReceivedAsync += e =>
            {
                Console.WriteLine($"Received  message [{e.ApplicationMessage.Topic}]: {Encoding.UTF8.GetString(e.ApplicationMessage.PayloadSegment)}");
                return Task.CompletedTask;
            };

            var result = await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);

            var mqttSubscribeOptions = mqttFactory.CreateSubscribeOptionsBuilder()
                .WithTopicFilter(
                    f =>
                    {
                        f.WithTopic(topic);
                        f.WithQualityOfServiceLevel(MqttQualityOfServiceLevel.ExactlyOnce);
                    })
                .Build();

            await mqttClient.SubscribeAsync(mqttSubscribeOptions, CancellationToken.None);

            Console.WriteLine($"MQTT client subscribed to topic: {topic}");
            Console.WriteLine("Press enter to exit.");
            Console.ReadLine();
        }
    }
} 