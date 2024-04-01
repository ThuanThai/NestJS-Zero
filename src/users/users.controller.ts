import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() userDto: CreateUserDto) {
        console.log(userDto);
        return this.usersService.create(userDto);
    }

    @Get()
    findAll() {
        return "testOK";
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.usersService.findOne(id);
    }

    @Patch()
    update(@Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(updateUserDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.usersService.remove(+id);
    }
}
