import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthMiddleware } from 'src/common/middlewares/auth.middleware';
import { Admin, AdminSchema } from './schema/admin.schema';
import { GoogleSignupStrategy } from './signup.strategy';
import { GoogleLoginStrategy } from './login.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    PassportModule.register({ session: true }),
  ],
  controllers: [AdminController],
  providers: [AdminService, GoogleSignupStrategy, GoogleLoginStrategy],
  exports: [AdminService],
})
export class AdminModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'api/admin/profile', method: RequestMethod.GET });
  }
}
