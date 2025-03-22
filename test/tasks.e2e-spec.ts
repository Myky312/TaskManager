/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreateTaskDto } from '../src/tasks/dto/create-task.dto';
import { TaskStatus } from '../src/tasks/entities/task.entity';

describe('Tasks', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let adminAccessToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    prismaService = app.get<PrismaService>(PrismaService);

    // Register and login admin as in your existing code
    const adminLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'adminpassword',
      });

    adminAccessToken = adminLoginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clear tasks before each test
    await prismaService.task.deleteMany();
  });

  it('/tasks (POST)', async () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Task description',
      status: TaskStatus.TODO,
    };

    return request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(createTaskDto)
      .expect(201)
      .expect((res) => {
        expect(res.body.title).toBe(createTaskDto.title);
        expect(res.body.status).toBe(createTaskDto.status);
      });
  });

  it('/tasks (GET)', async () => {
    // Create a task first
    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Task description',
      status: TaskStatus.TODO,
    };

    await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(createTaskDto);

    return request(app.getHttpServer())
      .get('/tasks')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        // eslint-disable-next-line prettier/prettier
        expect(res.body.some((task: any) => task.title === createTaskDto.title)).toBe(true);
      });
  });

  it('/tasks/:id (GET)', async () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Task description',
      status: TaskStatus.TODO,
    };

    const createdTask = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(createTaskDto);

    return request(app.getHttpServer())
      .get(`/tasks/${createdTask.body.id}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.title).toBe(createTaskDto.title);
      });
  });

  it('/tasks/:id (PATCH)', async () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Task description',
      status: TaskStatus.TODO,
    };

    const createdTask = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(createTaskDto);

    const updateTaskDto = { title: 'Updated Task' };

    return request(app.getHttpServer())
      .patch(`/tasks/${createdTask.body.id}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(updateTaskDto)
      .expect(200)
      .expect((res) => {
        expect(res.body.title).toBe(updateTaskDto.title);
      });
  });

  it('/tasks/:id (DELETE)', async () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Task description',
      status: TaskStatus.TODO,
    };

    const createdTask = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(createTaskDto);

    return request(app.getHttpServer())
      .delete(`/tasks/${createdTask.body.id}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);
  });
});
