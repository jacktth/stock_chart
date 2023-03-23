import { Module } from '@nestjs/common';
import { UserDataService } from './user-data.service';
import { UserDataController } from './user-data.controller';
import { PassportModule } from '@nestjs/passport';
import { SupabaseModule } from 'src/api/supabase.module';

@Module({
  imports:[PassportModule, SupabaseModule],
  controllers: [UserDataController],
  providers: [UserDataService],
})
export class UserDataModule {}
