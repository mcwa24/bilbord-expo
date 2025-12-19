import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

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
    const fromEmail = 'expo@bilbord.rs';

    const { data, error } = await resend.emails.send({
      from: fromEmail,
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
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f9c344; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #1d1d1f; margin: 0;">Bilbord Expo</h1>
            </div>
            <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
              <h2 style="color: #1d1d1f; margin-top: 0;">Vaš baner je uspešno postavljen!</h2>
              <p>Poštovani,</p>
              <p>Vaš baner ${bannerTitle ? `"${bannerTitle}"` : ''} je uspešno postavljen na <strong>Bilbord Expo</strong> platformu.</p>
              <p>Baner možete pregledati na sledećoj adresi:</p>
              <p style="margin: 20px 0;">
                <a href="${bannerLink}" style="color: #1d1d1f; text-decoration: underline; word-break: break-all;">${bannerLink}</a>
              </p>
              <p>Možete takođe posetiti našu platformu:</p>
              <p style="margin: 20px 0;">
                <a href="${siteUrl}" style="display: inline-block; background-color: #f9c344; color: #1d1d1f; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Posetite Bilbord Expo</a>
              </p>
              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                Srdačan pozdrav,<br>
                <strong>Bilbord Expo tim</strong>
              </p>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>© ${new Date().getFullYear()} Bilbord Expo. Sva prava zadržana.</p>
            </div>
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
