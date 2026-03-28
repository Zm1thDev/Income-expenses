import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './lib/prisma';

const app = express();
app.use(cors());
app.use(express.json());

const port = 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';


const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'กรุณาเข้าสู่ระบบก่อน' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      console.error('JWT Verification Error:', err.message);
      return res.status(403).json({ message: 'Token ไม่ถูกต้องหรือหมดอายุ' });
    }
    req.user = user;
    next();
  });
};


// API Register
app.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existingUser) {
      return res.status(400).json({ message: 'อีเมลนี้ถูกใช้งานไปแล้ว' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword
      }
    });

    return res.status(201).json({ message: 'ลงทะเบียนสำเร็จ', id: user.id });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
  }
});

// API Login
app.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'กรุณากรอกอีเมลและรหัสผ่าน' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, name: true, email: true, password: true },
    });

    if (!user) {
      return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'เข้าสู่ระบบสำเร็จ',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
  }
});

// API Get Categories
app.get('/categories', async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const where: any = {};
    if (type && (type === 'income' || type === 'expense')) {
      where.type = type;
    }

    const categories = await prisma.category.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    return res.json(categories);
  } catch (error) {
    console.error('Fetch Categories Error:', error);
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่' });
  }
});

// API Add Transaction
app.post('/transactions', authenticateToken, async (req: any, res: Response) => {
  try {
    const { type, amount, note, categoryName, transactionDate } = req.body;
    const userId = req.user.id;

    if (!type || !amount || !transactionDate) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' });
    }

    let categoryId = null;
    if (categoryName) {
      let category = await prisma.category.findFirst({
        where: {
          name: categoryName,
          type: type === 'income' ? 'income' : 'expense'
        }
      });

      if (!category) {
        category = await prisma.category.create({
          data: {
            name: categoryName,
            type: type === 'income' ? 'income' : 'expense'
          } as any
        });
      }
      categoryId = category.id;
    }

    const transaction = await prisma.transaction.create({
      data: {
        type: type === 'income' ? 'income' : 'expense',
        amount: parseFloat(amount),
        note: note || '',
        transactionDate: new Date(transactionDate),
        userId: userId,
        categoryId: categoryId
      }
    });

    return res.status(201).json({ message: 'บันทึกรายการสำเร็จ', transaction });
  } catch (error) {
    console.error('Transaction Error:', error);
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกรายการ' });
  }
});

// API Get Transaction
app.get('/transactions', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { type } = req.query;

    const where: any = { userId };
    if (type && (type === 'income' || type === 'expense')) {
      where.type = type;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: true
      }
    });
    return res.json(transactions);
  } catch (error) {
    console.error('Fetch Transactions Error:', error);
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
});

// API Get Summary
app.get('/summary', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const transactions = await prisma.transaction.findMany({
      where: { userId }
    });

    const income = transactions
      .filter((t: any) => t.type === 'income')
      .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

    const expense = transactions
      .filter((t: any) => t.type === 'expense')
      .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

    return res.json({
      income,
      expense,
      balance: income - expense
    });
  } catch (error) {
    console.error('Fetch Summary Error:', error);
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการคำนวณสรุป' });
  }
});

// API Delete Transaction
app.delete('/transactions/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const transactionId = parseInt(req.params.id);

    const existingTransaction = await prisma.transaction.findFirst({
      where: { id: transactionId, userId }
    });

    if (!existingTransaction) {
      return res.status(404).json({ message: 'ไม่พบรายการที่ต้องการลบ' });
    }

    await prisma.transaction.delete({
      where: { id: transactionId }
    });

    return res.json({ message: 'ลบรายการสำเร็จ' });
  } catch (error) {
    console.error('Delete Transaction Error:', error);
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบรายการ' });
  }
});

app.get('/', (req: Request, res: Response) => {
  res.send('Backend API is running...');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});