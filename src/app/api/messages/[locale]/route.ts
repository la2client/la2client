import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { locale: string } }
) {
  try {
    const messages = await import(`../../../../../messages/${params.locale}.json`);
    return NextResponse.json(messages.default);
  } catch (error) {
    return NextResponse.json({}, { status: 404 });
  }
}