import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@/lib/supabase/server';
import { sanitizeInput, isValidEmail } from '@/lib/security/xss-protection';
import SafariGuideEmail from '@/lib/email-templates/safari-guide';

export async function POST(request: NextRequest) {
  try {
    // Initialize Resend client inside the function to avoid build-time errors
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { email } = await request.json();

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Sanitize email
    const cleanEmail = sanitizeInput(email).toLowerCase().trim();

    // Store subscriber in database
    const supabase = await createClient();
    
    try {
      const { error: dbError } = await supabase
        .from('safari_guide_subscribers')
        .insert({
          email: cleanEmail,
          subscribed_at: new Date().toISOString(),
          source: 'home_page_lead_magnet',
        });

      // Log error but don't fail if subscriber already exists
      if (dbError && !dbError.message.includes('duplicate key')) {
        console.error('Database error:', dbError);
      }
    } catch (dbError) {
      // Continue even if database insert fails
      console.error('Failed to store subscriber:', dbError);
    }

    // Send email using Resend
    try {
      const { data, error: emailError } = await resend.emails.send({
        from: 'Kekeo Safaris <noreply@kekeosafaris.com>', // You'll need to verify your domain
        to: [cleanEmail],
        subject: '🦁 Your Free Safari Planning Guide - Kekeo Safaris',
        react: SafariGuideEmail({ userName: undefined }),
        // If you have a PDF guide, you can attach it here:
        // attachments: [
        //   {
        //     filename: 'Safari-Planning-Guide.pdf',
        //     path: './public/downloads/safari-planning-guide.pdf',
        //   },
        // ],
      });

      if (emailError) {
        console.error('Email sending error:', emailError);
        return NextResponse.json(
          { error: 'Failed to send email. Please try again later.' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Safari guide sent successfully! Check your inbox.',
        emailId: data?.id,
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
