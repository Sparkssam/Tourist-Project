import * as React from 'react';

interface SafariGuideEmailProps {
  userName?: string;
}

export const SafariGuideEmail: React.FC<SafariGuideEmailProps> = ({ userName }) => (
  <html>
    <head>
      <style>
        {`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #333;
          }
          .description {
            font-size: 16px;
            line-height: 1.8;
            color: #555;
            margin-bottom: 30px;
          }
          .guide-highlights {
            background-color: #f9f9f9;
            border-left: 4px solid #8B4513;
            padding: 20px;
            margin: 30px 0;
          }
          .guide-highlights h2 {
            margin-top: 0;
            color: #8B4513;
            font-size: 20px;
          }
          .guide-highlights ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          .guide-highlights li {
            margin: 8px 0;
            color: #555;
          }
          .cta-button {
            display: inline-block;
            background-color: #8B4513;
            color: white;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
          }
          .footer {
            background-color: #f9f9f9;
            padding: 30px;
            text-align: center;
            font-size: 14px;
            color: #777;
            border-top: 1px solid #e0e0e0;
          }
          .footer a {
            color: #8B4513;
            text-decoration: none;
          }
          .social-links {
            margin: 20px 0;
          }
          .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #8B4513;
            text-decoration: none;
          }
          .icon {
            font-size: 24px;
            margin-bottom: 10px;
          }
        `}
      </style>
    </head>
    <body>
      <div className="container">
        <div className="header">
          <div className="icon">🦁</div>
          <h1>Your Safari Planning Guide is Here!</h1>
        </div>
        
        <div className="content">
          <p className="greeting">
            {userName ? `Hello ${userName}` : 'Hello Safari Adventurer'},
          </p>
          
          <p className="description">
            Thank you for downloading our comprehensive <strong>Safari Planning Guide</strong>! 
            We're thrilled to help you prepare for the adventure of a lifetime in Tanzania.
          </p>
          
          <div className="guide-highlights">
            <h2>📚 What's Inside Your Guide:</h2>
            <ul>
              <li><strong>Best Times to Visit:</strong> Discover the optimal seasons for wildlife viewing and the Great Migration</li>
              <li><strong>Complete Packing List:</strong> Everything you need (and don't need) for your safari</li>
              <li><strong>Safari Etiquette:</strong> How to respect wildlife and local cultures</li>
              <li><strong>Photography Tips:</strong> Capture stunning shots of Africa's majestic wildlife</li>
              <li><strong>Health & Safety:</strong> Vaccinations, medications, and safety guidelines</li>
              <li><strong>Budget Planning:</strong> How to plan your safari to fit your budget</li>
              <li><strong>Insider Tips:</strong> Secrets from our expert safari guides</li>
            </ul>
          </div>
          
          <p className="description">
            This 25-page guide is packed with insights from our team of experienced safari guides 
            who have been leading tours across Tanzania for over a decade.
          </p>
          
          <center>
            <a href="https://kekeosafaris.com/tours" className="cta-button">
              Browse Our Safari Tours
            </a>
          </center>
          
          <p className="description" style={{ marginTop: '30px' }}>
            <strong>Ready to book your dream safari?</strong><br />
            Contact us for a personalized itinerary tailored to your interests, budget, and travel dates.
          </p>
        </div>
        
        <div className="footer">
          <p><strong>Kekeo Safaris</strong></p>
          <p>Experience the Magic of Tanzania</p>
          
          <div className="social-links">
            <a href="https://kekeosafaris.com">Visit Our Website</a> | 
            <a href="mailto:info@kekeosafaris.com">Contact Us</a>
          </div>
          
          <p style={{ marginTop: '20px', fontSize: '12px' }}>
            You're receiving this email because you requested our Safari Planning Guide from kekeosafaris.com.<br />
            If you no longer wish to receive emails from us, you can <a href="#">unsubscribe here</a>.
          </p>
        </div>
      </div>
    </body>
  </html>
);

export default SafariGuideEmail;
