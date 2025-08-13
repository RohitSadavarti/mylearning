from flask import Flask, send_file, send_from_directory
import os

app = Flask(__name__)

# Route for the main dashboard (index.html in root)
@app.route('/')
def dashboard():
    return send_file('index.html')

# Route for algorithm search page
@app.route('/algosearch')
def algosearch():
    return send_file('algosearch/index.html')

# Route for cipher page
@app.route('/cipher')
def cipher():
    return send_file('cipher/index.html')

# Route for serving static files from algosearch
@app.route('/algosearch/static/<path:filename>')
def algosearch_static(filename):
    return send_from_directory('algosearch/static', filename)

# Route for serving CSS files from algosearch
@app.route('/algosearch/static/css/<filename>')
def algosearch_css(filename):
    return send_from_directory('algosearch/static/css', filename)

# Route for serving JS files from algosearch
@app.route('/algosearch/static/js/<filename>')
def algosearch_js(filename):
    return send_from_directory('algosearch/static/js', filename)

# Route for serving static files from cipher
@app.route('/cipher/static/<path:filename>')
def cipher_static(filename):
    return send_from_directory('cipher/static', filename)

# Route for serving CSS files from cipher
@app.route('/cipher/static/css/<filename>')
def cipher_css(filename):
    return send_from_directory('cipher/static/css', filename)

# Route for serving JS files from cipher
@app.route('/cipher/static/js/<filename>')
def cipher_js(filename):
    return send_from_directory('cipher/static/js', filename)

# Error handler for 404
@app.errorhandler(404)
def not_found(error):
    return "Page not found!", 404

if __name__ == '__main__':
    # Get port from environment variable for Render deployment
    port = int(os.environ.get('PORT', 5000))
    
    # Check if all required directories exist
    required_dirs = [
        'algosearch',
        'algosearch/static',
        'algosearch/static/css',
        'algosearch/static/js',
        'cipher',
        'cipher/static',
        'cipher/static/css',
        'cipher/static/js'
    ]
    
    missing_dirs = []
    for dir_path in required_dirs:
        if not os.path.exists(dir_path):
            missing_dirs.append(dir_path)
    
    if missing_dirs:
        print("Warning: The following directories are missing:")
        for dir_path in missing_dirs:
            print(f"  - {dir_path}")
        print("\nPlease ensure your directory structure matches:")
        print("mylearning/")
        print("├── index.html")
        print("├── app.py")
        print("├── algosearch/")
        print("│   ├── index.html")
        print("│   └── static/")
        print("│       ├── css/")
        print("│       │   └── style.css")
        print("│       └── js/")
        print("│           └── script.js")
        print("└── cipher/")
        print("    ├── index.html")
        print("    └── static/")
        print("        ├── css/")
        print("        │   └── styles.css")
        print("        └── js/")
        print("            └── script.js")
    
    print(f"Starting Flask server on port {port}...")
    print("Dashboard will be available at the deployed URL")
    
    # For production deployment (like Render), disable debug mode
    debug_mode = os.environ.get('FLASK_ENV') == 'development'
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
