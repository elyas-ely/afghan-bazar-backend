import { Context } from 'hono';
import { db } from '../config/database';
import { users, createUserSchema, type CreateUserInput } from '../schema/user.schema';

export async function createUser(c: Context) {
  try {
    const body = await c.req.json();
    const validatedData = createUserSchema.parse(body);
    
    const newUser = await db.insert(users).values(validatedData).returning();
    return c.json({ user: newUser[0] }, 201);
  } catch (error) {
    return c.json({ error: 'Invalid input' }, 400);
  }
}

export async function getUsers(c: Context) {
  const allUsers = await db.select().from(users);
  return c.json({ users: allUsers });
}

export async function getUserById(c: Context) {
  const id = c.req.param('id');
  const user = await db.select().from(users).where(users.id = Number(id));
  
  if (!user.length) {
    return c.json({ error: 'User not found' }, 404);
  }
  
  return c.json({ user: user[0] });
}
