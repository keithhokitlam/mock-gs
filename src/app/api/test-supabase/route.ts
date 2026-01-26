import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    // Test 1: Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    // Test 2: Try a simple query
    const { data, error } = await supabaseServer
      .from("users")
      .select("id, email")
      .limit(1);

    return NextResponse.json({
      envVars: {
        hasUrl: !!supabaseUrl,
        urlPreview: supabaseUrl?.substring(0, 30) + "...",
        hasServiceKey: hasServiceKey,
      },
      queryResult: {
        success: !error,
        error: error ? {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        } : null,
        dataCount: data?.length || 0,
        sampleData: data?.[0] ? { id: data[0].id, email: data[0].email } : null,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
