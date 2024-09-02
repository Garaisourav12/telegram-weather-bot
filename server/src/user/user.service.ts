import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Services to be controlled by bot
  async userExists(chatId: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ chatId });

      return user;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }

      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async createUser(userData: {
    name: string;
    chatId: string;
    city: string;
  }): Promise<User> {
    const { name, chatId, city } = userData;

    try {
      const newUser = new this.userModel({ name, chatId, city });
      await newUser.save();
      return newUser;
    } catch (err) {
      throw new InternalServerErrorException('Subscription failed!');
    }
  }

  async subscribeUser(chatId: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ chatId });

      // Already blocked
      if (user.isBlocked) {
        throw new ForbiddenException('You are blocked. Please contact admin.');
      }

      // Already subscribed
      if (user.isSubscribed) {
        throw new ConflictException('You have already subscribed.');
      }

      user.isSubscribed = true;
      await user.save();
      return user;
    } catch (err) {
      if (
        err instanceof ForbiddenException ||
        err instanceof ConflictException
      ) {
        throw err;
      }

      throw new InternalServerErrorException('Subscription failed!');
    }
  }

  async unsubscribeUser(chatId: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ chatId });

      // Already blocked
      if (user.isBlocked) {
        throw new ForbiddenException('You are blocked. Please contact admin.');
      }

      // Already unsubscribed
      if (!user.isSubscribed) {
        throw new ConflictException('You have already unsubscribed.');
      }

      user.isSubscribed = false;
      const unsubscribedUser = await user.save();
      return unsubscribedUser;
    } catch (err) {
      if (
        err instanceof ForbiddenException ||
        err instanceof ConflictException
      ) {
        throw err;
      }

      throw new InternalServerErrorException('Unsubscription failed!');
    }
  }

  // Services to be controlled by admin
  async deleteUser(id: string): Promise<User> {
    if (!id) {
      throw new BadRequestException('Id is required to delete user.');
    }

    try {
      // First check if user exists then delete it
      const user = await this.userModel.findById(id);

      if (!user) {
        // Throw user not found with status code 404
        throw new NotFoundException('User not found!');
      }

      const deletedUser = await this.userModel.findByIdAndDelete(id);
      return deletedUser;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException('Internal server error!');
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const users = await this.userModel.find();
      return users;
    } catch (err) {
      throw new InternalServerErrorException('Internal server error!');
    }
  }

  async blockUser(id: string): Promise<User> {
    if (!id) {
      throw new BadRequestException('Id is required to block user.');
    }

    try {
      const user = await this.userModel.findById(id);

      if (!user) {
        throw new NotFoundException('User not found!');
      }

      if (user.isBlocked) {
        throw new ConflictException('User is already blocked!');
      }

      user.isBlocked = true;
      const blockedUser = await user.save();
      return blockedUser;
    } catch (err) {
      if (
        err instanceof NotFoundException ||
        err instanceof ConflictException
      ) {
        throw err;
      }

      throw new InternalServerErrorException('Internal server error!');
    }
  }

  async unblockUser(id: string): Promise<User> {
    if (!id) {
      throw new BadRequestException('Id is required to unblock user.');
    }

    try {
      const user = await this.userModel.findById(id);

      if (!user) {
        throw new NotFoundException('User not found!');
      }

      if (!user.isBlocked) {
        throw new ConflictException('User is already unblocked!');
      }

      user.isBlocked = false;
      const unblockedUser = await user.save();
      return unblockedUser;
    } catch (err) {
      if (
        err instanceof NotFoundException ||
        err instanceof ConflictException
      ) {
        throw err;
      }

      throw new InternalServerErrorException('Internal server error!');
    }
  }
}
