import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as TelegramBot from 'node-telegram-bot-api';
import { UserService } from 'src/user/user.service';
import * as cron from 'node-cron';

@Injectable()
export class TelegramService {
  private bot: TelegramBot;

  constructor(private readonly userService: UserService) {
    this.bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

    this.bot.on('message', (msg) => {
      if (msg.text === '/start') {
        this.start(msg);
      } else if (msg.text === '/subscribe') {
        this.subscribe(msg);
      } else if (msg.text === '/unsubscribe') {
        this.unsubscribe(msg);
      }
    });

    this.initateDailyWeatherUpdate();
  }

  initateDailyWeatherUpdate() {
    // daily at 12:05 am
    const cronExpression = '5 0 * * *';

    // For a single city weather will be fetched for one time only
    let cityWeatherConfig = {};

    cron.schedule(cronExpression, async () => {
      // First clear the cityWeatherConfig
      cityWeatherConfig = {};

      // Get all users
      const users = await this.userService.getUsers();

      // Fetch weather for all users
      users.forEach(async (user) => {
        const { chatId, city, isSubscribed, isBlocked } = user;

        // User is blocked or not subscribed
        if (isBlocked || !isSubscribed) {
          return;
        }

        // For a single city weather will be fetched for one time only
        if (city in cityWeatherConfig) {
          this.bot.sendMessage(chatId, cityWeatherConfig[city]);
          return;
        }

        // OpenWeatherMap API call if it is not fetched previously
        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}`;
        const weatherData = await axios.get(weatherApiUrl);

        // Description capitalized, temperature celsius and humidity in percentage
        const time = new Date(weatherData.data.dt);
        const description = weatherData.data.weather[0].main;
        const temperature = weatherData.data.main.temp;
        const humidity = weatherData.data.main.humidity;

        // For a single city weather will be fetched for one time only
        cityWeatherConfig[city] = this.getWeatherMessage(
          city,
          time,
          description,
          temperature,
          humidity,
        );

        this.bot.sendMessage(chatId, cityWeatherConfig[city]);
      });
    });
  }

  getWeatherMessage(
    city: string,
    time: Date,
    description: string,
    temperature: number,
    humidity: number,
  ) {
    // °C = (°F - 32) × 5/9 && store upto 2 decimal places
    const tempInCelsius =
      Math.floor((((temperature - 32) * 5) / 9) * 100) / 100;
    return `Daily Weather Update (${city}): ${description}\nTemperature: ${tempInCelsius}°C\nHumidity: ${humidity}%\nLast updated at: ${time}`;
  }

  start(msg) {
    this.bot.sendMessage(
      msg.chat.id,
      `Hi ${msg.from.first_name},\nWelcome to Weather Bot!\nYou can use commands:\n/start - start bot\n/subscribe - subscribe to weather updates\n/unsubscribe - unsubscribe from weather updates\nPlease choose one of the commands.`,
    );
  }

  async subscribe(msg) {
    const chatId = msg.chat.id;

    try {
      const user = await this.userService.userExists(chatId);

      if (!user) {
        this.bot.sendMessage(chatId, 'Please enter your city: ');

        this.getValidCity(chatId);
      } else {
        await this.userService.subscribeUser(chatId);
        this.bot.sendMessage(
          chatId,
          'You have successfully subscribed!\nAnd you will receive daily weather updates for your city at 8:00am.',
        );
      }
    } catch (err) {
      this.bot.sendMessage(chatId, err.message);
    }
  }

  async unsubscribe(msg) {
    const chatId = msg.chat.id;

    try {
      // If not exist automatically throw error
      const user = await this.userService.userExists(chatId);
      if (!user) {
        throw new Error('No subscribtion found!');
      }
      // If exists then unsubscribe
      await this.userService.unsubscribeUser(chatId);
      this.bot.sendMessage(chatId, 'You have successfully unsubscribed!');
    } catch (err) {
      this.bot.sendMessage(chatId, err.message);
    }
  }

  async getValidCity(chatId: string) {
    this.bot.once('message', async (msg) => {
      if (chatId !== msg.chat.id) {
        // Recursive call to listen again
        this.getValidCity(chatId);
        return;
      }

      // Exact city validation not implemented
      if (!/[a-zA-Z]/.test(msg.text)) {
        this.bot.sendMessage(chatId, 'Enter a valid city!');
        // Recursive call to listen again
        this.getValidCity(chatId);
        return;
      }

      const city = msg.text;

      const cityUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.API_KEY}`;
      const searchCity = await axios.get(cityUrl);

      if (searchCity.data[0].name.toLowerCase() !== city.toLowerCase()) {
        this.bot.sendMessage(chatId, 'Enter a valid city!');
        // Recursive call to listen again
        this.getValidCity(chatId);
        return;
      }

      await this.userService.createUser({
        name: msg.from.first_name,
        chatId,
        city: searchCity.data[0].name,
      });
      this.bot.sendMessage(
        chatId,
        'You have successfully subscribed!\nAnd you will receive daily weather updates for your city at 8:00am.',
      );
    });
  }
}
