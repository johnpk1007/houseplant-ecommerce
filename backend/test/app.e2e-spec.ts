import { describe, it, beforeAll, afterAll } from 'vitest'
import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { cleanPrismaDb, cleanS3Db } from './utils'
import { PrismaService } from '../src/prisma/prisma.service'
import { spec, request } from 'pactum'
import { AuthDto } from '../src/auth/dto'
import { S3Service } from '../src/s3/s3.service'
import { ConfigService } from '@nestjs/config'

describe('App e2e', () => {
  let app: INestApplication
  let prismaService: PrismaService
  let s3Service: S3Service
  let configService: ConfigService
  let customerDto: AuthDto
  let adminDto: AuthDto

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
    await app.listen(4000)
    prismaService = app.get(PrismaService)
    await cleanPrismaDb(prismaService)
    s3Service = app.get(S3Service)
    await cleanS3Db(s3Service)
    configService = app.get(ConfigService)
    request.setBaseUrl('http://localhost:4000')

    customerDto = {
      email: 'john@gmail.com',
      password: '123456'
    }

    adminDto = {
      email: configService.get('ADMIN_EMAIL') as string,
      password: configService.get('ADMIN_PASSWORD') as string
    }
  })

  afterAll(() => {
    app.close()
  })

  describe('signup and sign in', () => {
    it('should signup', () => {
      return spec()
        .post('/auth/signup')
        .withBody({ ...customerDto })
        .expectStatus(201)
    })
    it('should signin', () => {
      return spec()
        .post('/auth/signin')
        .withBody({ ...customerDto })
        .expectStatus(200)
        .stores('userToken', 'access_token')
    })
  })

})