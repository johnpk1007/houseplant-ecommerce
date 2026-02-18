import { describe, it, beforeAll, afterAll, vi } from 'vitest'
import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { cleanPrismaDb, cleanS3Db } from './utils'
import { PrismaService } from '../src/prisma/prisma.service'
import { spec, request } from 'pactum'
import { AuthDto } from '../src/auth/dto'
import { S3Service } from '../src/s3/s3.service'
import { ConfigService } from '@nestjs/config'
import { fakeFile1, fakeProductDto1, fakeFile2, fakeProductDto2, customerDto1, customerDto2 } from './utils'
import cookieParser from 'cookie-parser'
import { StripeService } from '../src/stripe/stripe.service'

describe('App e2e', () => {
  let app: INestApplication
  let prismaService: PrismaService
  let s3Service: S3Service
  let configService: ConfigService
  let adminDto: AuthDto

  const mockStripeService = {
    createProduct: vi.fn().mockResolvedValue({ id: 'fakeStripeId', default_price: 'fakeStripePrice' } as any),
    updateProduct: vi.fn().mockResolvedValue({} as any),
    createSession: vi.fn().mockResolvedValue({ id: 'fakeStripeSessionId' } as any),
    constructEvent: vi.fn().mockReturnValue({ type: 'checkout.session.completed', data: { object: { id: 'fakeStripeSessionId' } } } as any),
    checkoutSession: vi.fn().mockResolvedValue({ payment_status: 'paid' } as any),
    refund: vi.fn().mockResolvedValue({} as any)
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(StripeService)
      .useValue(mockStripeService)
      .compile()
    app = moduleRef.createNestApplication();
    app.use(cookieParser());
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

    adminDto = {
      email: configService.get('ADMIN_EMAIL') as string,
      password: configService.get('ADMIN_PASSWORD') as string
    }
  })

  afterAll(() => {
    app.close()
  })

  describe('Admin sign in as admin and upload product and edit the quantity', () => {
    it('should signin as admin', () => {
      return spec()
        .post('/auth/signin')
        .withBody({ ...adminDto })
        .expectStatus(200)
        .stores('adminAccessToken', 'access_token')
        .stores('adminRefreshToken', 'res.headers.set-cookie[0]')
    })
    it('should upload product 1', () => {
      return spec()
        .post('/product')
        .withBearerToken('$S{adminAccessToken}')
        .withCookies('$S{adminRefreshToken}')
        .withMultiPartFormData('file', fakeFile1.buffer, {
          filename: fakeFile1.originalname,
          contentType: fakeFile1.mimetype,
        })
        .withMultiPartFormData({ ...fakeProductDto1 })
        .expectStatus(201)
        .stores('productId1', 'id')
    })
    it('should upload product 2', () => {
      return spec()
        .post('/product')
        .withBearerToken('$S{adminAccessToken}')
        .withCookies('$S{adminRefreshToken}')
        .withMultiPartFormData('file', fakeFile2.buffer, {
          filename: fakeFile2.originalname,
          contentType: fakeFile2.mimetype,
        })
        .withMultiPartFormData({ ...fakeProductDto2 })
        .expectStatus(201)
        .stores('productId2', 'id')
    })
    it('should update product 1 quantity', () => {
      return spec()
        .patch('/product/$S{productId1}')
        .withBearerToken('$S{adminAccessToken}')
        .withCookies('$S{adminRefreshToken}')
        .withMultiPartFormData({ stock: 1 })
        .expectStatus(200)
    })
    it('should update product 2 quantity', () => {
      return spec()
        .patch('/product/$S{productId2}')
        .withBearerToken('$S{adminAccessToken}')
        .withCookies('$S{adminRefreshToken}')
        .withMultiPartFormData({ stock: 1 })
        .expectStatus(200)
    })
    it('should signout', () => {
      return spec()
        .post('/auth/signout')
        .withBearerToken('$S{adminAccessToken}')
        .withCookies('$S{adminRefreshToken}')
        .expectStatus(200)
    })
  })

  describe('Customer 1 signup and signin', () => {
    it('should signup', () => {
      return spec()
        .post('/auth/signup')
        .withBody({ ...customerDto1 })
        .expectStatus(201)
        .stores('customer1AccessToken', 'access_token')
        .stores('customer1RefreshToken', 'res.headers.set-cookie[0]')
    })
  })

  describe('Customer 2 signup and signin', () => {
    it('should signup', () => {
      return spec()
        .post('/auth/signup')
        .withBody({ ...customerDto2 })
        .expectStatus(201)
        .stores('customer2AccessToken', 'access_token')
        .stores('customer2RefreshToken', 'res.headers.set-cookie[0]')
    })
  })

  describe('Customer put product 1 in the cart and order', () => {
    it('should put product in cart', () => {
      return spec()
        .post('/cart-item')
        .withBody({ productId: '$S{productId1}', quantity: 1 })
        .withBearerToken('$S{customer1AccessToken}')
        .withCookies('$S{customer1RefreshToken}')
        .expectStatus(201)
    })
    it('should get all cart item', () => {
      return spec()
        .get('/cart-item')
        .withBearerToken('$S{customer1AccessToken}')
        .withCookies('$S{customer1RefreshToken}')
        .expectStatus(200)
        .stores('cartItemId', '[0].id')
    })
    it('should order and pay', () => {
      return spec()
        .post('/payment')
        .withBody({ cartItemIdArr: ['$S{cartItemId}'] })
        .withBearerToken('$S{customer1AccessToken}')
        .withCookies('$S{customer1RefreshToken}')
        .expectStatus(200)
    })
    it('should check payment', () => {
      return spec()
        .post('/payment/webhook')
        .expectStatus(200)
    })
  })

  describe('Customer put product which is out of stock', () => {
    it('should put product in cart', () => {
      return spec()
        .post('/cart-item')
        .withBody({ productId: '$S{productId1}', quantity: 1 })
        .withBearerToken('$S{customer2AccessToken}')
        .withCookies('$S{customer2RefreshToken}')
        .expectStatus(400)
    })
  })
})