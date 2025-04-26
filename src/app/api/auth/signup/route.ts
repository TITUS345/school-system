import connectDB from '@/utils/db';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { name, email, password, role, signupKey, loggedInAdminId } = await req.json();

  await connectDB();

  // if any users exist in the system
  const usersCount = await User.countDocuments();

  if (usersCount === 0) {
    // unrestricted signup for the first Admin
    if (role !== 'Admin') {
      return NextResponse.json({ error: 'The first user must be an Admin!' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //first Admin user
    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    try {
      await newAdmin.save();
      return NextResponse.json({ message: 'First Admin registered successfully!' });
    } catch (error) {
      console.error("Error saving first Admin:", error);
      return NextResponse.json({ error: 'Failed to register the first Admin!' }, { status: 500 });
    }
  }

  //regular signup after the first Admin exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: 'Email already in use!' }, { status: 400 });
  }

  // Restrict Admin creation (after the first Admin is created)
  if (role === 'Admin') {
    const loggedInAdmin = await User.findById(loggedInAdminId);
    if (!loggedInAdmin || loggedInAdmin.role !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized to create Admin account!' }, { status: 403 });
    }
  } else {
    // signupKey is valid for Teachers or Students
    if (!signupKey || signupKey !== process.env.ADMIN_SIGNUP_KEY) {
      return NextResponse.json({ error: 'Invalid signup key!' }, { status: 401 });
    }
  }

  // Hash the password for regular users
  const hashedPassword = await bcrypt.hash(password, 10);

  // new user (Teacher or Student or Admin with logged-in approval)
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role,
  });

  try {
    await newUser.save();
    return NextResponse.json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json({ error: 'Failed to register user!' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role"); // Get the role from the query string (e.g., 'Teacher')

  let users;
  if (role) {
    // Fetch users with the specified role
    users = await User.find({ role }).select('-password'); // Exclude password
  } else {
    // Fetch all users if no role is specified
    users = await User.find().select('-password'); // Exclude password
  }

  console.log("Fetched users:", users);

  if (!users || users.length === 0) {
    return NextResponse.json({ error: 'No users found!' }, { status: 404 });
  }

  return NextResponse.json({
    message: 'Users fetched successfully!',
    users,
  });
}