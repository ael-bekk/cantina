from django.conf import settings
from django.core.mail import EmailMessage
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
import requests


def send_access_email(subject, message, student_img_url=None):

    email = EmailMessage(
        subject=subject,
        body=message,
        to=settings.TO_EMAIL,
        cc=settings.CC_EMAIL,
        from_email=settings.ADMIN_EMAIL,
        reply_to=[settings.ADMIN_EMAIL],
    )
    if student_img_url:
        # Download the image from the URL
        response = requests.get(student_img_url)
        image_data = response.content

        # Create a MIMEImage instance from the image data
        mime_image = MIMEImage(image_data)

        # Attach the image to the email
        email.attach(mime_image)

    email.send()
