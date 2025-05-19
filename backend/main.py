from connectors import postgres


def start_backend():
    db_type = input("Enter database type (postgres/mysql/oracle/mongodb): ").lower()
    config = {
        "host": input("Host: "),
        "port": input("Port: "),
        "user": input("Username: "),
        "password": input("Password: "),
        "database": input("Database Name: ")
    }

    if db_type == "postgres":
        try:
            conn = postgres.connect_postgres(config)
            print("✅ Connected to PostgreSQL")

            tables = postgres.get_tables(conn)
            print("\n📋 Tables:")
            for t in tables:
                print(" -", t)

            for t in tables:
                cols = postgres.get_columns(conn, t)
                print(f"\n🔍 {t} Columns:")
                for col in cols:
                    print("   -", col[0], ":", col[1])

            conn.close()
        except Exception as e:
            print("❌ Connection failed:", str(e))

    else:
        print("❌ Unsupported or not implemented yet!")


if __name__ == "__main__":
    start_backend()
