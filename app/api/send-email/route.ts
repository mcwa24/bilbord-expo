import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase-server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, bannerLink, bannerTitle } = body;

    if (!to || !bannerLink) {
      return NextResponse.json(
        { error: 'Email and banner link are required' },
        { status: 400 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://expo.bilbord.rs';
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kqpmbcknztcofausqzfa.supabase.co';
    
    // Get logo URL from Supabase storage - try different possible locations
    let logoUrl = `${siteUrl}/FINAL LOGO BILBORD-06.png`; // Fallback to public folder
    
    // Try to get logo from Supabase storage buckets
    const possibleBuckets = ['logos', 'assets', 'images', 'public'];
    const possiblePaths = ['bilbord-logo.png', 'logo.png', 'FINAL LOGO BILBORD-06.png'];
    
    for (const bucket of possibleBuckets) {
      for (const path of possiblePaths) {
        try {
          const { data: logoData } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);
          if (logoData?.publicUrl) {
            // Verify the URL is accessible
            const testResponse = await fetch(logoData.publicUrl, { method: 'HEAD' });
            if (testResponse.ok) {
              logoUrl = logoData.publicUrl;
              break;
            }
          }
        } catch (e) {
          // Continue to next option
        }
      }
      if (logoUrl !== `${siteUrl}/FINAL LOGO BILBORD-06.png`) break;
    }

    const { data, error } = await resend.emails.send({
      from: 'Bilbord Expo <expo@bilbord.rs>',
      to: to,
      subject: 'Vaš baner je postavljen na Bilbord Expo platformu',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Baner postavljen na Bilbord Expo</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1d1d1f; background-color: #f5f5f7; margin: 0; padding: 0;">
            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f7; padding: 20px;">
              <tr>
                <td align="center" style="padding: 40px 20px;">
                  <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                    <!-- Header with Logo -->
                    <tr>
                      <td style="background-color: #ffffff; padding: 40px 40px 30px 40px; text-align: center; border-bottom: 1px solid #e5e5e7;">
                        <img src="${logoUrl}" alt="Bilbord Expo" style="max-width: 200px; height: auto; display: block; margin: 0 auto;" />
                      </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <h2 style="color: #1d1d1f; margin: 0 0 20px 0; font-size: 24px; font-weight: 700; line-height: 1.2;">Vaš baner je uspešno postavljen!</h2>
                        <p style="color: #1d1d1f; margin: 0 0 16px 0; font-size: 16px; line-height: 1.5;">Poštovani,</p>
                        <p style="color: #1d1d1f; margin: 0 0 24px 0; font-size: 16px; line-height: 1.5;">Vaš baner${bannerTitle ? ` "${bannerTitle}"` : ''} je uspešno postavljen na <strong style="color: #1d1d1f; font-weight: 700;">Bilbord Expo</strong> platformu.</p>
                        <p style="color: #1d1d1f; margin: 0 0 32px 0; font-size: 16px; line-height: 1.5;">Možete ga pregledati na našoj platformi:</p>
                        <!-- CTA Button -->
                        <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 40px 0;">
                          <tr>
                            <td align="center" style="padding: 0;">
                              <a href="${siteUrl}" style="display: inline-block; background-color: #f9c344; color: #1d1d1f; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: -0.2px;">Posetite Bilbord Expo</a>
                            </td>
                          </tr>
                        </table>
                        <!-- Footer Text -->
                        <p style="color: #86868b; margin: 40px 0 0 0; font-size: 14px; line-height: 1.5;">
                          Srdačan pozdrav,<br>
                          <strong style="color: #1d1d1f; font-weight: 700;">Bilbord Expo tim</strong>
                        </p>
                      </td>
                    </tr>
                    <!-- Bottom Footer -->
                    <tr>
                      <td style="background-color: #f5f5f7; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e5e7;">
                        <p style="color: #86868b; margin: 0; font-size: 12px; line-height: 1.4;">© ${new Date().getFullYear()} Bilbord Expo. Sva prava zadržana.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
