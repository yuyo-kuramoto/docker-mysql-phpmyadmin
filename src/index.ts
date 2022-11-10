import { PrismaClient } from '@prisma/client';
import express from 'express'
import morgan from 'morgan';
// import { nanoid } from 'nanoid';

const prisma=new PrismaClient({log:['error','info','query','warn']});
// const genId=()=>nanoid(16);

const seedDatabase =async()=>{
  if((await prisma.user.count())===0){
    await prisma.user.create({
      data: {
        name: 'Tom',
        email: 'tom@test.com',
        age: 25,
        bio:'Hello',
        posts: {
          create: { title: 'Hello World' },
        },
        profile: {
          create: { bio: 'I am Mike' },
        },
      },
    })
  }
}

seedDatabase();

const app = express();
app.use(morgan('dev'));

app.get('/',async(req,res)=>{
  const users =await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    },
  })
  res.json(users);
})

const port =Number(process.env.PORT ?? 8080);
app.listen(port,'0.0.0.0',()=>{
  console.log(`Server started at http://localhost:${port}`)
})