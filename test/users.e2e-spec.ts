/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { LoginDto } from '../src/auth/dto/login.dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { Role } from '../src/users/entities/user.entity';

describe('Users', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let adminAccessToken: string; // Store the admin's access token

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    prismaService = app.get<PrismaService>(PrismaService);

    // Clear database before all tests
    await prismaService.task.deleteMany();
    await prismaService.user.deleteMany();

    // Register an admin user for authentication
    const adminUserDto: CreateUserDto = {
      email: 'admin@example.com',
      password: 'adminpassword',
      role: Role.ADMIN,
    };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(adminUserDto);

    // Login the admin user to get the access token
    const adminLoginDto: LoginDto = {
      email: 'admin@example.com',
      password: 'adminpassword',
    };

    const adminLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(adminLoginDto);

    adminAccessToken = adminLoginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clear users before each test, except admin.  Important, but was causing issues.
    await prismaService.user.deleteMany({
      where: {
        email: {
          not: 'admin@example.com',
        },
      },
    });
  });

  it('/users (POST)', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password',
      role: Role.ADMIN, //  Important:  Create an ADMIN user here.
    };

    return request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${adminAccessToken}`) // Use admin token
      .send(createUserDto)
      .expect(201)
      .expect((res) => {
        const responseBody = res.body as { email: string; role: string };
        expect(responseBody.email).toBe(createUserDto.email);
        expect(responseBody.role).toBe(createUserDto.role);
        // Don't check password in response
      });
  });

  it('/users (GET)', async () => {
    // Create a user first
    const createUserDto: CreateUserDto = {
      email: 'test2@example.com',
      password: 'password',
      role: Role.ADMIN, //  Important:  Create an ADMIN user here.
    };
    await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${adminAccessToken}`) // Use admin token
      .send(createUserDto);

    await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${adminAccessToken}`) // Use admin token
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect((res.body as any[]).length).toBeGreaterThanOrEqual(1);
        const responseBody = res.body as { email: string; role: string }[];
        expect(
          responseBody.some((user) => user.email === createUserDto.email),
        ).toBe(true);
      });
  });

  it('/users/:id (GET)', async () => {
    const createUserDto = {
      email: 'test3@example.com',
      password: 'password',
      role: Role.ADMIN, //  Important:  Create an ADMIN user here.
    };
    const createdUser = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${adminAccessToken}`) // Use admin token
      .send(createUserDto);

    await request(app.getHttpServer())
      .get(`/users/${(createdUser.body as { id: string }).id}`)
      .set('Authorization', `Bearer ${adminAccessToken}`) // Use admin token
      .expect(200)
      .expect((res) => {
        const responseBody = res.body as { email: string; role: string };
        expect(responseBody.email).toBe(createUserDto.email);
      });
  });

  it('/users/:id (PATCH)', async () => {
    const createUserDto = {
      email: 'test4@example.com',
      password: 'password',
      role: Role.ADMIN, //  Important:  Create an ADMIN user here.
    };
    const createdUser = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${adminAccessToken}`) // Use admin token
      .send(createUserDto);
    const updateUserDto = { email: 'updated@example.com' };

    await request(app.getHttpServer())
      .patch(`/users/${(createdUser.body as { id: string }).id}`)
      .set('Authorization', `Bearer ${adminAccessToken}`) // Use admin token
      .send(updateUserDto)
      .expect(200)
      .expect((res) => {
        const responseBody = res.body as { email: string };
        expect(responseBody.email).toBe(updateUserDto.email);
      });
  });

  it('/users/:id (DELETE)', async () => {
    const createUserDto = {
      email: 'test5@example.com',
      password: 'password',
      role: Role.ADMIN, //  Important:  Create an ADMIN user here.
    };
    const createdUser = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${adminAccessToken}`) // Use admin token
      .send(createUserDto);

    return request(app.getHttpServer())
      .delete(`/users/${(createdUser.body as { id: string }).id}`)
      .set('Authorization', `Bearer ${adminAccessToken}`) // Use admin token
      .expect(200);
  });
});
