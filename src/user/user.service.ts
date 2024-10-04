import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async findAll(query: FilterUserDto): Promise<any> {
    const items_per_page = Number(query.items_per_page) || 10;
    const page = Number(query.page) || 1;
    const skip = (page - 1) * items_per_page;
    const keyword = query.search || '';

    //phương thức của TypeORM repository
    //Tìm kiếm các bản ghi dựa trên điều kiện được cung cấp
    //Đếm tổng số bản ghi phù hợp với điều kiện, không phụ thuộc vào pagination
    //res: Một mảng chứa danh sách các bản ghi phù hợp với điều kiện tìm kiếm.
    //total: Tổng số bản ghi phù hợp với điều kiện (số lượng toàn bộ bản ghi không phụ thuộc vào take và skip)
    const [res, total] = await this.userRepository.findAndCount({
      //Like tìm kiếm dựa trên mẫu chuỗi.
      //%: Là ký tự đại diện trong SQL.
      //'%keyword%' có nghĩa là tìm kiếm bất kỳ chuỗi nào có chứa keyword ở bất kỳ vị trí nào trong chuỗi.
      where: [
        { first_name: Like('%' + keyword + '%') },
        { last_name: Like('%' + keyword + '%') },
        { email: Like('%' + keyword + '%') },
      ],
      order: { created_at: 'DESC' }, // Descending-giảm dần
      take: items_per_page, //số lượng bản ghi tối đa sẽ được trả về cho mỗi lần truy vấn
      skip: skip, //số lượng bản ghi sẽ bỏ qua khi truy vấn
      select: [
        'id',
        'first_name',
        'last_name',
        'email',
        'status',
        'created_at',
        'updated_at',
      ],
    });
    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
    return {
      data: res,
      total,
      currentPage: page,
      nextPage,
      prevPage,
      lastPage,
    };
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashPassword = await bcrypt.hash(createUserDto.password, 10); //mã hóa bằng hàm băm vòng lặp 10
    return await this.userRepository.save(createUserDto);
  }
  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    //UpdateResult trả về số lượng bản ghi đã được cập nhật, hoặc các thông tin liên quan khác.
    return await this.userRepository.update(id, updateUserDto);
  }

  async delete(id: number): Promise<DeleteResult> {
    //DeleteResult chua thông tin về kết quả của quá trình xóa trong cơ sở dữ liệu.
    return await this.userRepository.delete(id);
  }

  async updateAvatar(id: number, avatar: string): Promise<UpdateResult> {
    return await this.userRepository.update(id, { avatar });
  }
}
