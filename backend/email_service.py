import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os


def send_booking_confirmation(
    to_email: str,
    name: str,
    confirmation_code: str,
    session_title: str,
    session_date: str,
    session_time: str,
):
    """Send booking confirmation email. Fails silently if SMTP not configured."""
    smtp_host = os.getenv("SMTP_HOST", "")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER", "")
    smtp_pass = os.getenv("SMTP_PASS", "")
    from_email = os.getenv("FROM_EMAIL", "noreply@somastudio.gr")

    if not smtp_host or not smtp_user:
        print(f"[EMAIL] SMTP not configured. Confirmation for {name}: {confirmation_code}")
        print(f"  Session: {session_title} | Date: {session_date} | Time: {session_time}")
        return False

    html_body = f"""
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 24px; color: #2a2a2a;">
        <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; color: #1a1a1a; margin: 0;">SOMA</h1>
            <p style="color: #c4866e; font-size: 12px; letter-spacing: 3px; margin: 4px 0 0;">FITNESS STUDIO</p>
        </div>
        <h2 style="font-size: 20px; color: #1a1a1a; margin-bottom: 16px;">Επιβεβαίωση Κράτησης</h2>
        <p>Γεια σας <strong>{name}</strong>,</p>
        <p>Η κράτησή σας ολοκληρώθηκε επιτυχώς!</p>
        <div style="background: #f7f3f0; border-radius: 8px; padding: 24px; margin: 24px 0;">
            <p style="margin: 0 0 8px;"><strong>Μάθημα:</strong> {session_title}</p>
            <p style="margin: 0 0 8px;"><strong>Ημερομηνία:</strong> {session_date}</p>
            <p style="margin: 0 0 8px;"><strong>Ώρα:</strong> {session_time}</p>
            <div style="text-align: center; margin-top: 20px;">
                <p style="font-size: 14px; color: #6b6b6b; margin-bottom: 8px;">Κωδικός Επιβεβαίωσης</p>
                <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #c4866e;">{confirmation_code}</div>
            </div>
        </div>
        <p style="font-size: 13px; color: #6b6b6b;">Παρουσιάστε αυτόν τον κωδικό κατά την άφιξή σας.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">SOMA Fitness Studio</p>
    </div>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Επιβεβαίωση Κράτησης — SOMA [{confirmation_code}]"
    msg["From"] = from_email
    msg["To"] = to_email
    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
        return True
    except Exception as e:
        print(f"[EMAIL] Failed to send: {e}")
        return False
