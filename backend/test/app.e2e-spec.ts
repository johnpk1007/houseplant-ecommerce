import { describe, it, beforeAll, afterAll } from 'vitest'
import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { cleanPrismaDb } from './utils'
import { PrismaService } from '../src/prisma/prisma.service'
import { spec, request } from 'pactum'
import { AuthDto } from '../src/auth/dto'

describe('App e2e', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true
      })
    )
    await app.listen(3000)
    prisma = app.get(PrismaService)
    await cleanPrismaDb(prisma)
    request.setBaseUrl('http://localhost:3000')
  })

  afterAll(() => {
    app.close()
  })

  describe('auth', () => {
    const dto: AuthDto = {
      email: 'john@gmail.com',
      password: '123'
    }
    describe('signup', () => {
      it('should signup', () => {
        return spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
      })
    })
    describe('sign in', () => {
      it('should signup', () => {
        return spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userToken', 'access_token')
      })
    })
    describe('profile', () => {
      it('should be authorized to access profile page', () => {
        return spec()
          .get('/auth/profile')
          .withHeaders({
            Authorization: 'Bearer $S{userToken}'
          })
          .expectStatus(200)
      })
    })
  })
})