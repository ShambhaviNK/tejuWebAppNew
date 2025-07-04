import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    console.log('🔍 Checking if user exists...');
    
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single();

    console.log('Check result:', { existingUser, checkError });

    if (checkError) {
      console.error('❌ Database check error:', checkError);
      console.error('Error code:', checkError.code);
      console.error('Error message:', checkError.message);
      
      if (checkError.code === 'PGRST116') {
        // No user found, continue with signup
        console.log('✅ No existing user found, proceeding with signup');
      } else {
        return NextResponse.json(
          { error: `Database error: ${checkError.message}` },
          { status: 500 }
        );
      }
    }

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    console.log('🔐 Hashing password...');
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log('📝 Creating user in database...');
    
    // Create user in database
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          password: hashedPassword,
        }
      ])
      .select('id, name, email, created_at')
      .single();

    if (insertError) {
      console.error('❌ User creation error:', insertError);
      console.error('Error code:', insertError.code);
      console.error('Error message:', insertError.message);
      return NextResponse.json(
        { error: `Failed to create user: ${insertError.message}` },
        { status: 500 }
      );
    }

    console.log('✅ User created successfully:', newUser);

    return NextResponse.json({
      message: 'User created successfully',
      user: newUser
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Signup error:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 