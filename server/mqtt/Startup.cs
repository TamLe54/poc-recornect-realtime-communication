using System.Text;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using MQTTnet.AspNetCore;
using MQTTnet.Server;

public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services
        .AddHostedMqttServer(mqttServer => mqttServer.WithoutDefaultEndpoint())
        .AddMqttConnectionHandler()
        .AddConnections();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseRouting();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapMqtt("/mqtt");
        });

        app.UseMqttServer(server =>
        {
            server.ValidatingConnectionAsync += ValidateConnection;
            server.ClientConnectedAsync += OnClientConnected;
            server.ClientDisconnectedAsync += OnClientDisconnected;
            server.InterceptingPublishAsync += OnApplicationMessageReceived;
        });

        app.Use((context, next) =>
        {
            if (context.Request.Path == "/")
            {
                context.Request.Path = "/Index.html";
            }

            return next();
        });

        app.UseStaticFiles();

        // app.UseStaticFiles(new StaticFileOptions
        // {
        //     RequestPath = "/node_modules",
        //     FileProvider = new PhysicalFileProvider(Path.Combine(env.ContentRootPath, "node_modules"))
        // });
    }

    public Task ValidateConnection(ValidatingConnectionEventArgs eventArgs)
    {
        Console.WriteLine($"Client '{eventArgs.ClientId}' wants to connect. Accepting!");
        Console.WriteLine($"Username: {eventArgs.UserName}");
        Console.WriteLine($"Password: {eventArgs.Password}");
        return Task.CompletedTask;
    }

    public Task OnClientConnected(ClientConnectedEventArgs eventArgs)
    {
        Console.WriteLine($"Client '{eventArgs.ClientId}' connected.");
        return Task.CompletedTask;
    }

    public Task OnClientDisconnected(ClientDisconnectedEventArgs eventArgs)
    {
        Console.WriteLine($"Client '{eventArgs.ClientId}' disconnected. Reason: {eventArgs.ReasonCode}.");
        return Task.CompletedTask;
    }
    public Task OnApplicationMessageReceived(InterceptingPublishEventArgs eventArgs)
    {
        Console.WriteLine($"Message received from client '{eventArgs.ClientId}'. Topic: {eventArgs.ApplicationMessage.Topic}. Payload: {Encoding.UTF8.GetString(eventArgs.ApplicationMessage.PayloadSegment.ToArray())}");
        return Task.CompletedTask;
    }
}