import { NextResponse } from 'next/server';
import connectDB from '@/lib/infrastructure/mongoDB';
import Setting from '@/models/Setting';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    
    if (key) {
      const setting = await Setting.findOne({ key });
      return NextResponse.json({ success: true, data: setting ? setting.value : null });
    }
    
    const settings = await Setting.find({});
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { key, value } = body;
    
    if (!key) {
      return NextResponse.json({ success: false, error: 'Key is required' }, { status: 400 });
    }
    
    const setting = await Setting.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }
    );
    
    return NextResponse.json({ success: true, data: setting });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
