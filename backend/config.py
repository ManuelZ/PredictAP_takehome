# Where to save the index
DATABASE_PATH = './db.sqlite3'
TEST_DATA_PATH = './test_data'
TABLE_NAME = 'indexdb'

# Fields used in the `add_records` function when inserting data into the DB
# 'path' must be the first field
FIELDS_NAMES = [
  'path',
  'filename',
  'filetype',
  'filesize',
]