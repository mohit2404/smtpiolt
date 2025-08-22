import { type NextRequest, NextResponse } from "next/server";
import { createEmailTransporter } from "@/lib/utils/nodemailer";
import { TestSMTPRequest } from "@/lib/types";
import { validateSMTPConfig } from "@/lib/utils/validate";

export async function POST(request: NextRequest) {
  try {
    const body: TestSMTPRequest = await request.json();
    const { smtpConfig } = body;

    // Validate SMTP configuration
    const validationError = validateSMTPConfig(smtpConfig);
    if (validationError) {
      return NextResponse.json(
        {
          success: false,
          error: validationError,
        },
        { status: 400 }
      );
    }

    // Test the SMTP connection
    const { transporter, error } = await createEmailTransporter(smtpConfig);

    if (!transporter || error) {
      return NextResponse.json(
        {
          success: false,
          error: `SMTP connection failed: ${error}`,
        },
        { status: 400 }
      );
    }

    // Close the connection after testing
    if (transporter.close) {
      transporter.close();
    }

    return NextResponse.json({
      success: true,
      message: "SMTP connection successful",
    });
  } catch (error: any) {
    console.error("SMTP test error:", error?.message || error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error?.message : "SMTP test failed",
      },
      { status: 500 }
    );
  }
}
