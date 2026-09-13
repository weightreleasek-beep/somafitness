from sqlalchemy import create_engine, text
from sqlalchemy.engine.url import make_url
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
from pathlib import Path
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://soma_user:soma_pass@localhost:5432/soma_db")

# Render uses postgres:// but SQLAlchemy requires postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)


def _sqlite_url() -> str:
    candidates = [
        Path(os.getenv("RENDER_DISK_PATH", "/data")),
        Path("/opt/render/project/src/backend"),
        Path.cwd(),
    ]
    for folder in candidates:
        try:
            folder.mkdir(parents=True, exist_ok=True)
            probe = folder / ".write_test"
            probe.write_text("ok", encoding="utf-8")
            probe.unlink()
            db_path = (folder / "soma.db").resolve()
            print(f"[DB] Using SQLite at {db_path}")
            return "sqlite:///" + db_path.as_posix()
        except OSError:
            continue
    return "sqlite:///soma.db"


def _create_engine(url: str):
    connect_args = {}
    if url.startswith("sqlite"):
        connect_args = {"check_same_thread": False}
        db_file = make_url(url).database
        if db_file:
            Path(db_file).parent.mkdir(parents=True, exist_ok=True)
    elif url.startswith("postgresql"):
        connect_args = {"connect_timeout": 8}
    return create_engine(url, connect_args=connect_args, pool_pre_ping=True)


def _can_connect(eng) -> bool:
    try:
        with eng.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception as exc:
        print(f"[DB] Connection failed: {exc}")
        return False


engine = _create_engine(DATABASE_URL)
if not _can_connect(engine):
    print("[DB] Falling back to SQLite so the site can start")
    DATABASE_URL = _sqlite_url()
    engine = _create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
