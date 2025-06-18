// src/app/api/send-email/route.js
import nodemailer from "nodemailer";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // const body = await req.json();
    // const { to, subject, text, html } = body;

    const to = "ktyrrishabh99361032@gmail.com"
    const subject = "test mail"
    const text = "test api"
    const html = "<strong>This is an HTML message.</strong>"



    if (!to || !subject || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.in',
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Sgtmake App" <${process.env.ZOHO_EMAIL}>`,
      to,
      subject,
      text,
      html,
    });

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });

  } catch (error) {
    console.error('Zoho email send error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
