import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    const requiredFields = ['name', 'age', 'email', 'password', 'username']
    for (const field of requiredFields) {
      if (!userData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userData.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const age = parseInt(userData.age)
    if (isNaN(age) || age < 13 || age > 120) {
      return NextResponse.json(
        { error: 'Age must be between 13 and 120' },
        { status: 400 }
      )
    }

    if (userData.password.length < 4) {
      return NextResponse.json(
        { error: 'Password must be at least 4 characters long' },
        { status: 400 }
      )
    }

    
    console.log('New user signup:', {
      name: userData.name,
      age: userData.age,
      email: userData.email,
      username: userData.username,
      preferences: {
        likedFoods: userData.likedFoods,
        likedPeople: userData.likedPeople,
        likedActivities: userData.likedActivities,
        dislikedFoods: userData.dislikedFoods,
        dislikedActivities: userData.dislikedActivities
      }
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Account created successfully',
        user: { 
          id: Date.now(), // In production, use proper ID generation
          username: userData.username,
          email: userData.email,
          name: userData.name
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
