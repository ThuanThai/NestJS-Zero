import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class CompaniesService {
    constructor(
        @InjectModel(Company.name)
        private companyModel: SoftDeleteModel<CompanyDocument>
    ) {}
    create(createCompanyDto: CreateCompanyDto, user: IUser) {
        return this.companyModel.create({
            ...createCompanyDto,
            createdBy: {
                _id: user._id,
                email: user.email,
            },
        });
    }

    async findAll(page: number, limit: number, qs: string) {
        const { filter, skip, sort, projection, population } = aqp(qs);
        delete filter.page;
        delete filter.limit;

        let defaultLimit = +limit ? +limit : 10;
        let offset = (+page - 1) * +limit;

        const totalItems = (await this.companyModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);
        const result = await this.companyModel
            .find(filter)
            .skip(offset)
            .limit(defaultLimit)
            // @ts-ignore: Unreachable code error
            .sort(sort)
            .populate(population)
            .exec();

        return {
            meta: {
                current: page, //trang hiện tại
                pageSize: limit, //số lượng bản ghi đã lấy
                pages: totalPages, //tổng số trang với điều kiện query
                total: totalItems, // tổng số phần tử (số bản ghi)
            },
            result, //kết quả query
        };
    }

    findOne(id: number) {
        return `This action returns a #${id} company`;
    }

    update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
        return this.companyModel.updateOne(
            { _id: id },
            {
                ...updateCompanyDto,
                updatedBy: { _id: user._id, email: user.email },
            }
        );
    }

    remove(id: string, user: IUser) {
        this.companyModel.updateOne(
            { _id: id },
            {
                deleteBy: {
                    _id: user._id,
                    email: user.email,
                },
            }
        );
        return this.companyModel.softDelete({ _id: id });
    }
}
