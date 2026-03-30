
import imaplib
import os
import email

def read_email_subjects(email_user, email_pass):
    try:
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(email_user, email_pass)
        mail.select("INBOX")

        result, data = mail.search(None, "ALL")
        mail_ids = data[0]

        id_list = mail_ids.split()
        latest_email_ids = id_list[-3:]  # Get the IDs of the 3 latest emails

        for i, email_id in enumerate(reversed(latest_email_ids)):  # Iterate in reverse to get the latest first
            result, data = mail.fetch(email_id, "(RFC822)")  # Fetch the email
            raw_email = data[0][1]  # Get the raw email content
            msg = email.message_from_bytes(raw_email)
            subject = msg["Subject"]
            print(f"Email {i+1} Subject: {subject}")

        mail.close()
        mail.logout()

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    email_user = os.environ.get("EMAIL_USER")
    email_pass = os.environ.get("EMAIL_PASS")

    if not email_user or not email_pass:
        print("Please set the EMAIL_USER and EMAIL_PASS environment variables.")
    else:
        read_email_subjects(email_user, email_pass)
