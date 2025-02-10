import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AllgoodPropEntity } from './entities/allgood-prop';
import { AllgoodPropDto } from './dto/allgood-prop';

@Injectable()
export class AllgoodPropService {
  constructor(
    @InjectRepository(AllgoodPropEntity, 'main')
    private readonly allgoodPropRepository: Repository<AllgoodPropEntity>,
  ) {}

  async create(data: AllgoodPropDto) {
    const prop = this.allgoodPropRepository.create(data);
    return await this.allgoodPropRepository.save(prop);
  }

  findAll() {
    return this.allgoodPropRepository.find();
  }

  async findOneByBank(id: number) {
    return this.allgoodPropRepository.findOneBy({ bank_unique: id });
  }

  async deleteProp(id: string) {
    const prop = await this.allgoodPropRepository.findOneBy({ id });
    if (!prop) {
      throw new Error('Prop not found');
    }
    prop.status = 'deactive';
    return await this.allgoodPropRepository.save(prop);
  }
}
