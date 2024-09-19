'use server';

import { SignupFormSchema, FormState } from '@/lib/definitions';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { signIn } from '@/auth';
import { prisma } from "@/prisma"

export async function signup(state: FormState, formData: FormData | undefined) {
  // Ensure formData is defined and is of correct type
  if (!formData || !(formData instanceof FormData)) {
    console.log(formData)
    return {
      errors: { message: 'Form data is missing or invalid.' },
    };
  }

  // 1. Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    surname: formData.get('surname'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // 2. If validation fails, return errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password, surname } = validatedFields.data;

  // 3. Check if user already exists
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { errors: { email: ['User already exists'] } };
    }
  } catch (error) {
    return {
      message: 'An error occurred while checking existing user.',
    };
  }

  // 4. Hash the password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch (error) {
    return {
      message: 'An error occurred while hashing the password.',
    };
  }

  // 5. Create a new user
  let user;
  try {
    user = await prisma.user.create({
      data: {
        name,
        surname,
        email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    return {
      message: 'An error occurred while creating your account.',
    };
  }

  if (!user) {
    return {
      message: 'User creation failed. Please try again.',
    };
  }

  // 6. Sign in the user automatically
  const result = await signIn('credentials', {
    redirect: false,
    email,
    password,
  });

  if (result?.error) {
    return { message: 'An error occurred while signing in.' };
  }

  // 7. Redirect user to homepage or another page after successful sign-up
  redirect('/'); // Redirect to homepage or dashboard
}

