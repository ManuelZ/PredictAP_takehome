# Take Home Project

Challenge: A directory contains multiple files and directories of non-uniform file and directory names. Create a program that traverses a base directory and creates an index file that can be used to quickly lookup files by name, size, and content type.

# Usage

## Backend

The backend uses Python 3. The backend requirements are defined in the `requirements.txt` file. Run from the root of the repo:
```
python3 -m pip install -r backend/requirements.txt
```

Run the backend development server from the root of the repo:
```
python backend/backend.py
```

The target directory to be indexed is defined in `config.py`.

The backend has been tested with Flask 1.1.2 and Python 3.8.8 .


## Frontend

The frontend uses React. The frontend requirements are defined in `package.json`:

```
cd frontend
npm install
```

Run the frontend development server:
```
npm run dev
```

The application is available in: `http://127.0.0.1:5173/`

The frontend has been tested with Node v16.0.0 and React v18.2 .