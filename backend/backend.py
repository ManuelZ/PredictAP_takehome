# Built-in imports
from pathlib import Path
import sqlite3 as sql

# External imports
from flask import Flask
from flask import request
from flask import make_response
from flask import Response
from flask import jsonify
from flask_cors import CORS
from flask import g # for sqlite3

# Local imports
from config import DATABASE_PATH
from config import TABLE_NAME
from config import FIELDS_NAMES


BASEDIR_PATH = './test_data'
STORAGE_PATH = './db.pickle'

app = Flask(
    __name__, 
)

CORS(app)


def get_conn():
    """
    From:
    https://flask.palletsprojects.com/en/rtd/patterns/sqlite3/
    """

    conn = getattr(g, '_database', None)
    if conn is None:
        conn = g._database = sql.connect(DATABASE_PATH)
    conn.row_factory = sql.Row
    
    return conn


@app.teardown_appcontext
def close_connection(exception):
    """ From https://flask.palletsprojects.com/en/rtd/patterns/sqlite3/ """
    conn = getattr(g, '_database', None)
    if conn is not None:
        conn.close()


def create_table():
    try:
        conn = get_conn()
        cur = conn.cursor()

        # TODO: Make this dependent on config.FIELDS_NAMES
        create_table_sql = """
            CREATE TABLE {} (
                path TEXT PRIMARY KEY,
                filename TEXT NOT NULL,
                filetype TEXT NOT NULL,
                filesize INTEGER NOT NULL
            )"""
        create_table_sql = create_table_sql.format(TABLE_NAME)
        cur.execute(create_table_sql)
        conn.commit()
    
    except Exception as e:
        raise Exception(f'Error when creating table: {str(e)}')


def add_records(records):
    """
    Insert records in the SQLite3 database.

    Parameters
    ----------
        data: a list of dicts
    """

    # Transform the data into a list of lists
    data = []
    for record in records:
        row = []
        for field in FIELDS_NAMES:
            value = record.get(field, '')
            row.append(value)
        data.append(row)

    try:
        with sql.connect(DATABASE_PATH) as conn:
            cur = conn.cursor()
    
            # Insert records with path that don't exist (path is the primary key)
            insert_sql = "INSERT OR IGNORE INTO {} ({}) VALUES ({})".format(
                TABLE_NAME,
                ','.join(f'"{f}"' for f in FIELDS_NAMES),
                ','.join(['?'] * len(FIELDS_NAMES))
            )

            # Bulk insert
            cur.executemany(insert_sql, data)
            conn.commit()
    
    except Exception as e:
        print(e)


@app.route('/list_files', methods=['POST'])
def list_files():

    if request.args:
        try:
            limit = int(request.args.get('limit'))
            limit = limit if ((limit > 0) and (limit <1e6)) else 20
            
            offset = int(request.args.get('offset'))
            offset = offset if (offset >= 0 and offset <1e6) else 0

            lower_filesize_limit = int(request.args.get('lower_filesize_limit'))
            upper_filesize_limit = int(request.args.get('upper_filesize_limit'))

            filetypes = request.args.get('filetypes', '')
            if filetypes != '':
                filetypes_filter = ','.join(f'"{f.lower()}"' for f in filetypes.split(','))
            else:
                filetypes_filter = ''

            # The percent sign % wildcard matches any sequence of zero or more characters
            filename_filter = request.args.get('filename', '%')
            filename_filter = f"%{filename_filter}%"
        
        except Exception as e:
            msg = f"Trouble when parsing the given arguments:\n{e}"
            print(msg)
            return jsonify({'msg': msg})

    if Path(DATABASE_PATH).exists():
        
        try:
            cur = get_conn().cursor()        
            select_sql = f'''
                SELECT * FROM {TABLE_NAME} 
                WHERE filetype IN ({filetypes_filter}) 
                AND 
                filename LIKE "{filename_filter}" 
                AND 
                filesize BETWEEN {lower_filesize_limit} AND {upper_filesize_limit} 
                LIMIT {limit} OFFSET {offset}
            '''
            print(select_sql)
            cur.execute(select_sql)
            rows = cur.fetchall()
            data = [dict(row) for row in rows]
            msg = 'Success'
        
        except Exception as e:
            msg = f"Error in SELECT operation: {e}"
            print(msg)
            data = ''
        
        finally:
            return jsonify({'msg':msg, 'data':data})
    
    else:
        return make_response({"error": "index doesn't exist"}, 200)


@app.route('/create_index', methods=['POST'])
def create_index():
    base_directory = Path(BASEDIR_PATH)

    files = []
    for child in base_directory.glob('**/*.*'):
        if child.is_file():
            filename = child.name
            filesize = int(child.stat().st_size)
            filetype = child.suffix.lstrip(".").lower()
            absolute_path = str(child.absolute())

            print(f"File: {child.name}, Size: {filesize} bytes, filetype: {filetype}")

            files.append({
                'path': absolute_path,
                'filename': filename,
                'filesize': filesize,
                'filetype': filetype
            })
    
    try:
        if not Path(DATABASE_PATH).exists():
            create_table()
        
        add_records(files)
        return make_response(jsonify({"total_files": len(files)}), 200)
    
    except Exception as e:
        print(f"Error serializing the index: {str(e)}")
        return Response(status=500)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)