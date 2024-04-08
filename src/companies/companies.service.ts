import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

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

    findAll() {
        return `This action returns all companies`;
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
