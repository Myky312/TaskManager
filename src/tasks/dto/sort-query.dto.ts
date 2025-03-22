/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class SortQueryDto {
  @IsOptional()
  @Transform(({ obj }) => obj['sort[field]']) // Extract manually
  field?: 'createdAt' | 'updatedAt';

  @IsOptional()
  @Transform(({ obj }) => obj['sort[order]'])
  order?: 'asc' | 'desc';
}
