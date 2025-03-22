/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { LoginDto } from '../src/auth/dto/login.dto';
import { PrismaService } from '../src/prisma/prisma.service';

describe('App e2e', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    prismaService = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  // Clear the database before each test
  beforeEach(async () => {
    // Delete all tasks
    await prismaService.task.deleteMany();
    // Delete all users
    await prismaService.user.deleteMany();
  });
  describe('Authentication', () => {
    it('/register (POST)', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.email).toBe(createUserDto.email);
        });
    });

    it('/login (POST)', async () => {
      // First, register a user *within this test*
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
      };
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto);

      const loginUserDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login') // Use the correct route   <-----  CHANGE THIS LINE
        .send(loginUserDto)
        .expect(200);

      expect(loginResponse.body).toHaveProperty('access_token');
      expect(loginResponse.body.access_token).toBeTruthy();
      return loginResponse.body.access_token; // Return the token for the next test
    });

    it('/profile (GET)', async () => {
      // Register a user and get the token *within this test*
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
      };
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto);

      const loginUserDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginUserDto);

      const accessToken = loginResponse.body.access_token;

      // Now use the token to access the profile
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.email).toBe(createUserDto.email);
          expect(res.body).toHaveProperty('sub'); // Check for the 'sub' property instead of 'id'
        });
    });
  });
});
