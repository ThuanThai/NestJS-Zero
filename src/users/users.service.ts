import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import mongoose, { Model } from "mongoose";
import { genSaltSync, hashSync, compareSync } from "bcryptjs";
import passport from "passport";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    getHashPassword(plaintextPassword: string) {
        const saltRounds = 10;
        const salt = genSaltSync(saltRounds);
        const hash = hashSync(plaintextPassword, salt);
        return hash;
    }

    async create(userDto: CreateUserDto) {
        const hashPassword = this.getHashPassword(userDto.password);
        const user = await this.userModel.create({
            email: userDto.email,
            password: hashPassword,
            name: userDto.name,
        });
        return user;
    }

    findAll() {
        return `This action returns all users`;
    }

    findOne(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) return "Not found user";
        return this.userModel.findOne({ _id: id });
    }

    findByUserName(userName: string) {
        return this.userModel.findOne({ email: userName });
    }

    update(updateUserDto: UpdateUserDto) {
        return this.userModel.updateOne(
            { _id: updateUserDto._id },
            { ...updateUserDto }
        );
    }

    remove(id: number) {
        return this.userModel.deleteOne({ _id: id });
    }

    isValidatePassword(password: string, hash: string) {
        return compareSync(password, hash);
    }
}
