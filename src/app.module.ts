import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CompaniesModule } from './companies/companies.module';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URI'),
                connectionFactory: (connection: any) => {
                    connection.plugin(softDeletePlugin);
                    return connection;
                },
            }),
            inject: [ConfigService],
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        UsersModule,
        AuthModule,
        CompaniesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
