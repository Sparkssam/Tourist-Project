// Test script to verify Resend API is working
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function testResend() {
  try {
    console.log('Testing Resend API...');
    console.log('API Key present:', !!process.env.RESEND_API_KEY);
    console.log('API Key prefix:', process.env.RESEND_API_KEY?.substring(0, 10) + '...');
    
    const result = await resend.emails.send({
      from: 'noreply@kekeosafaris.com',
      to: ['samsuya999@gmail.com'],
      subject: 'Test Email from Resend',
      html: '<h1>Test</h1><p>If you receive this, Resend is working!</p>',
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Result:', result);
  } catch (error) {
    console.error('❌ Failed to send email:');
    console.error('Error:', error);
    console.error('Message:', error?.message);
    console.error('Stack:', error?.stack);
  }
}

testResend();