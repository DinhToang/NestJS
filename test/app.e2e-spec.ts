import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
describe('App e2e', ()=>{
  let app: INestApplication;
  beforeAll(async () =>{
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,//loại bỏ các nhân tố mà không được định dạng trong dto (data injection)
    }));

    await app.init();
  });

  afterAll(() => {
    app.close();
  })
  it.todo('shold pass');
   
});