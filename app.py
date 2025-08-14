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

# NEW ROUTES FOR CROSS-NAVIGATION FROM SUBPAGES
# Route for algosearch to cipher navigation
@app.route('/algosearch/cipher')
def algosearch_to_cipher():
    return send_file('cipher/index.html')

# Route for cipher to algosearch navigation  
@app.route('/cipher/algosearch')
def cipher_to_algosearch():
    return send_file('algosearch/index.html')

# Route for algosearch to home navigation
@app.route('/algosearch/home')
@app.route('/algosearch/')
def algosearch_to_home():
    return send_file('index.html')

# Route for cipher to home navigation
@app.route('/cipher/home')
@app.route('/cipher/')
def cipher_to_home():
    return send_file('index.html')

# STATIC FILE ROUTES - Updated to handle cross-domain serving

# Serve algosearch static files from any path
@app.route('/algosearch/static/<path:filename>')
@app.route('/cipher/algosearch/static/<path:filename>')  # For cross-navigation
def algosearch_static(filename):
    return send_from_directory('algosearch/static', filename)

# Serve algosearch CSS files from any path
@app.route('/algosearch/static/css/<filename>')
@app.route('/cipher/algosearch/static/css/<filename>')  # For cross-navigation
def algosearch_css(filename):
    return send_from_directory('algosearch/static/css', filename)

# Serve algosearch JS files from any path
@app.route('/algosearch/static/js/<filename>')
@app.route('/cipher/algosearch/static/js/<filename>')  # For cross-navigation
def algosearch_js(filename):
    return send_from_directory('algosearch/static/js', filename)

# Serve algosearch CSS files directly
@app.route('/algosearch/<filename>.css')
@app.route('/cipher/algosearch/<filename>.css')  # For cross-navigation
def algosearch_direct_css(filename):
    css_path = f'algosearch/{filename}.css'
    if os.path.exists(css_path):
        return send_file(css_path, mimetype='text/css')
    return "CSS file not found", 404

# Serve cipher static files from any path
@app.route('/cipher/static/<path:filename>')
@app.route('/algosearch/cipher/static/<path:filename>')  # For cross-navigation
def cipher_static(filename):
    return send_from_directory('cipher/static', filename)

# Serve cipher CSS files from any path
@app.route('/cipher/static/css/<filename>')
@app.route('/algosearch/cipher/static/css/<filename>')  # For cross-navigation
def cipher_css(filename):
    return send_from_directory('cipher/static/css', filename)

# Serve cipher JS files from any path
@app.route('/cipher/static/js/<filename>')
@app.route('/algosearch/cipher/static/js/<filename>')  # For cross-navigation
def cipher_js(filename):
    return send_from_directory('cipher/static/js', filename)

# Serve cipher CSS files directly
@app.route('/cipher/<filename>.css')
@app.route('/algosearch/cipher/<filename>.css')  # For cross-navigation
def cipher_direct_css(filename):
    css_path = f'cipher/{filename}.css'
    if os.path.exists(css_path):
        return send_file(css_path, mimetype='text/css')
    return "CSS file not found", 404

# Global static file serving (fallback)
@app.route('/static/<path:filename>')
def global_static(filename):
    # Try cipher first, then algosearch
    if os.path.exists(f'cipher/static/{filename}'):
        return send_from_directory('cipher/static', filename)
    elif os.path.exists(f'algosearch/static/{filename}'):
        return send_from_directory('algosearch/static', filename)
    return "File not found", 404

# Error handler for 404
@app.errorhandler(404)
def not_found(error):
    return f"Page not found! Available routes: /, /algosearch, /cipher", 404

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
        print("│   ├── algosidebar.css")
        print("│   ├── algosidebar.js")
        print("│   └── static/")
        print("│       ├── css/")
        print("│       │   └── style.css")
        print("│       └── js/")
        print("│           └── script.js")
        print("└── cipher/")
        print("    ├── index.html")
        print("    ├── sidebar.css")
        print("    ├── sidebar.js")
        print("    └── static/")
        print("        ├── css/")
        print("        │   └── style.css")
        print("        └── js/")
        print("            └── script.js")
    
    print(f"Starting Flask server on port {port}...")
    print("Dashboard will be available at the deployed URL")
    print("Routes available:")
    print("  - / (Dashboard)")
    print("  - /algosearch (Algorithm Visualizer)")
    print("  - /cipher (Cipher Visualizer)")
    
    # For production deployment (like Render), disable debug mode
    debug_mode = os.environ.get('FLASK_ENV') == 'development'
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
