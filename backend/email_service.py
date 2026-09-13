import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os


def _smtp_config():
    return {
        "host": os.getenv("SMTP_HOST", ""),
        "port": int(os.getenv("SMTP_PORT", "587")),
        "user": os.getenv("SMTP_USER", ""),
        "password": os.getenv("SMTP_PASS", ""),
        "from_email": os.getenv("FROM_EMAIL", "noreply@somastudio.gr"),
    }


def _wrap_html(inner_html: str) -> str:
    return f"""
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 24px; color: #2a2a2a;">
        <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; color: #1a1a1a; margin: 0;">SOMA</h1>
            <p style="color: #c4866e; font-size: 12px; letter-spacing: 3px; margin: 4px 0 0;">FITNESS STUDIO</p>
        </div>
        {inner_html}
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">SOMA Fitness Studio</p>
    </div>
    """


def _send_email(to_email: str, subject: str, html_body: str) -> bool:
    cfg = _smtp_config()
    if not cfg["host"] or not cfg["user"]:
        print(f"[EMAIL] SMTP not configured. To: {to_email} | Subject: {subject}")
        return False

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = cfg["from_email"]
    msg["To"] = to_email
    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP(cfg["host"], cfg["port"]) as server:
            server.starttls()
            server.login(cfg["user"], cfg["password"])
            server.send_message(msg)
        return True
    except Exception as e:
        print(f"[EMAIL] Failed to send: {e}")
        return False


def send_booking_pending(
    to_email: str,
    name: str,
    session_title: str,
    session_date: str,
    session_time: str,
):
    """Notify the client that the booking request is awaiting trainer approval."""
    inner = f"""
        <h2 style="font-size: 20px; color: #1a1a1a; margin-bottom: 16px;">Αίτημα Κράτησης</h2>
        <p>Γεια σας <strong>{name}</strong>,</p>
        <p>Λάβαμε το αίτημα κράτησής σας. Η γυμνάστρια θα το εξετάσει και θα ενημερωθείτε με email για την αποδοχή ή την απόρριψη.</p>
        <div style="background: #f7f3f0; border-radius: 8px; padding: 24px; margin: 24px 0;">
            <p style="margin: 0 0 8px;"><strong>Μάθημα:</strong> {session_title}</p>
            <p style="margin: 0 0 8px;"><strong>Ημερομηνία:</strong> {session_date}</p>
            <p style="margin: 0;"><strong>Ώρα:</strong> {session_time}</p>
        </div>
        <p style="font-size: 13px; color: #6b6b6b;">Η κράτηση οριστικοποιείται μόνο μετά την αποδοχή, ώστε κάθε τμήμα να έχει το κατάλληλο επίπεδο.</p>
    """
    print(f"[EMAIL] Pending request for {name}: {session_title} | {session_date} {session_time}")
    return _send_email(
        to_email,
        f"Αίτημα Κράτησης — SOMA [{session_title}]",
        _wrap_html(inner),
    )


def send_booking_confirmation(
    to_email: str,
    name: str,
    confirmation_code: str,
    session_title: str,
    session_date: str,
    session_time: str,
):
    """Send booking confirmation email after trainer approval. Fails silently if SMTP not configured."""
    inner = f"""
        <h2 style="font-size: 20px; color: #1a1a1a; margin-bottom: 16px;">Επιβεβαίωση Κράτησης</h2>
        <p>Γεια σας <strong>{name}</strong>,</p>
        <p>Η κράτησή σας έγινε αποδεκτή!</p>
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
    """
    print(f"[EMAIL] Confirmation for {name}: {confirmation_code}")
    print(f"  Session: {session_title} | Date: {session_date} | Time: {session_time}")
    return _send_email(
        to_email,
        f"Επιβεβαίωση Κράτησης — SOMA [{confirmation_code}]",
        _wrap_html(inner),
    )


def send_booking_rejected(
    to_email: str,
    name: str,
    session_title: str,
    session_date: str,
    session_time: str,
):
    """Notify the client that the trainer declined the booking request."""
    inner = f"""
        <h2 style="font-size: 20px; color: #1a1a1a; margin-bottom: 16px;">Αίτημα Κράτησης</h2>
        <p>Γεια σας <strong>{name}</strong>,</p>
        <p>Δυστυχώς το αίτημα κράτησής σας δεν έγινε αποδεκτό για αυτό το τμήμα.</p>
        <div style="background: #f7f3f0; border-radius: 8px; padding: 24px; margin: 24px 0;">
            <p style="margin: 0 0 8px;"><strong>Μάθημα:</strong> {session_title}</p>
            <p style="margin: 0 0 8px;"><strong>Ημερομηνία:</strong> {session_date}</p>
            <p style="margin: 0;"><strong>Ώρα:</strong> {session_time}</p>
        </div>
        <p style="font-size: 13px; color: #6b6b6b;">Μπορείτε να δοκιμάσετε άλλο μάθημα ή ώρα από την ιστοσελίδα μας.</p>
    """
    print(f"[EMAIL] Rejected request for {name}: {session_title} | {session_date} {session_time}")
    return _send_email(
        to_email,
        f"Αίτημα Κράτησης — SOMA [{session_title}]",
        _wrap_html(inner),
    )
