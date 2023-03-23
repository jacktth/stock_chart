import { Injectable } from '@nestjs/common';
import { Supabase } from 'src/api/supabase';
import { CreateUserDatumDto } from './dto/create-user-datum.dto';
import { UpdateUserDatumDto } from './dto/update-user-datum.dto';
import { Categories } from './types/types';

@Injectable()
export class UserDataService {
  constructor(private readonly supabase: Supabase) {}
  create(createUserDatumDto: CreateUserDatumDto) {
    return 'This action adds a new userDatum';
  }

  findAll() {
    return `This action returns all userData`;
  }

  async findAllCategories(apiKey: string) {
    console.log(apiKey,"1");
    
    const { data, error } = await this.supabase.getClient().from("apikeys").select().eq("api_key",apiKey)
    if(!!error){
      console.log("data",error);
      
      return error
    } else {
      console.log(data);
      
      const userId = data[0].user_id
      const { data:categoriesQueryData, error } = await this.supabase.getClient().from('categories').select().eq('user_id',userId);
      const categories:Categories = []
      categoriesQueryData.forEach((data)=>{
        categories.push(data.name)
      })
      return categories
    }
  }

  update(id: number, updateUserDatumDto: UpdateUserDatumDto) {
    return `This action updates a #${id} userDatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} userDatum`;
  }
}
