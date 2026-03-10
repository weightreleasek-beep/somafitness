"""Initialize the PostgreSQL database for SOMA Fitness Studio."""
import subprocess
import sys
from database import engine, Base
from models import ContactInquiry, NewsletterSubscription


def create_database():
    """Create the PostgreSQL database and user if they don't exist."""
    commands = [
        "CREATE USER soma_user WITH PASSWORD 'soma_pass';",
        "CREATE DATABASE soma_db OWNER soma_user;",
        "GRANT ALL PRIVILEGES ON DATABASE soma_db TO soma_user;",
    ]
    for cmd in commands:
        try:
            subprocess.run(
                ["sudo", "-u", "postgres", "psql", "-c", cmd],
                capture_output=True, text=True
            )
        except Exception as e:
            print(f"Note: {e}")


def create_tables():
    """Create all tables."""
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")


if __name__ == "__main__":
    print("Creating database and user...")
    create_database()
    print("Creating tables...")
    create_tables()
    print("Done! Database is ready.")
