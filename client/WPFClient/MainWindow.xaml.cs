using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection.PortableExecutable;
using System.Reflection;
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
using Microsoft.AspNetCore.SignalR.Client;
using System.Threading.Tasks.Dataflow;
using MaterialDesignThemes.Wpf;
using WPFClient.Views;

namespace WPFClient
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {

        public MainWindow()
        {
            InitializeComponent();
        }

        private void TabControl_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (!(sender is TabControl tabControl)) return;

            var selectedTab = tabControl.SelectedItem as TabItem;

            if (selectedTab?.Header.ToString() == "SignalR")
            {
                // Render SignalR view
                contentControl.Children.Clear();
                contentControl.Children.Add(new Signalr());
            }
            else if (selectedTab?.Header.ToString() == "MQTT")
            {
                // Render MQTT view
                contentControl.Children.Clear();
                contentControl.Children.Add(new MQTT());
            }
        }   

    }
}

