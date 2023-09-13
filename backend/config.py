# Where to save the index
DATABASE_PATH = './db.sqlite3'
TABLE_NAME = 'indexdb'

# Fields used in the `add_records` function when inserting data into the DB
# 'path' must be the first field
FIELDS_NAMES = [
  'path',
  'filename',
  'filetype',
  'filesize',
]