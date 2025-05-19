import psycopg2


def connect_postgres(config):
    conn = psycopg2.connect(
        host=config["host"],
        port=config["port"],
        user=config["user"],
        password=config["password"],
        dbname=config["database"]
    )
    return conn


def get_tables(conn):
    cur = conn.cursor()
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';")
    tables = [row[0] for row in cur.fetchall()]
    cur.close()
    return tables


def get_columns(conn, table_name):
    cur = conn.cursor()
    cur.execute(f"""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = %s;
    """, (table_name,))
    columns = cur.fetchall()
    cur.close()
    return columns
