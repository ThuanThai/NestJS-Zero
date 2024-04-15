import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { ValidationPipe } from "@nestjs/common";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { TransformInterceptor } from "./core/transform.interceptor";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const reflector = app.get(Reflector);
    app.useGlobalGuards(new JwtAuthGuard(reflector));
    app.useGlobalInterceptors(new TransformInterceptor(reflector));

    app.useStaticAssets(join(__dirname, "..", "public"));
    app.useGlobalPipes(new ValidationPipe());
    app.setBaseViewsDir(join(__dirname, "..", "views"));
    app.setViewEngine("ejs");
    app.enableCors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
    });
    await app.listen(process.env.PORT);
}
bootstrap();
