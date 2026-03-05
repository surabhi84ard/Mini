from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__, 
            template_folder='.',  # HTML files in root directory
            static_folder='static')  # Static files (CSS, JS, images) in static folder

# Configure Flask
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  # Disable caching during development

# ==================== MAIN ROUTES ====================

@app.route('/')
@app.route('/index.html')
def homepage():
    """Homepage route"""
    return render_template('index.html', active_page='home')

@app.route('/about.html')
@app.route('/about')
def about_us():
    """About Us page"""
    return render_template('about.html', active_page='about')

@app.route('/course-details.html')
@app.route('/course-details')
def course_details():
    """Course Details page"""
    return render_template('course-details.html', active_page='course-details')

@app.route('/admission.html')
@app.route('/admission')
def admission():
    """Admission page"""
    return render_template('admission.html', active_page='admission')

@app.route('/payment.html')
@app.route('/payment')
def payment():
    """Payment page"""
    return render_template('payment.html', active_page='payment')

# ==================== STATIC FILES ====================

@app.route('/styles.css')
def serve_css():
    """Serve CSS file from root directory"""
    return send_from_directory('.', 'styles.css', mimetype='text/css')

@app.route('/script.js')
def serve_js():
    """Serve JavaScript file from root directory"""
    return send_from_directory('.', 'script.js', mimetype='application/javascript')

# ==================== STATIC FOLDER ROUTE ====================

@app.route('/static/<path:filename>')
def serve_static(filename):
    """Serve files from static folder (images, etc.)"""
    return send_from_directory('static', filename)

# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def page_not_found(e):
    """Handle 404 errors"""
    return render_template('index.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    """Handle 500 errors"""
    return "Internal Server Error", 500

# ==================== HELPER ROUTES ====================

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return {'status': 'healthy', 'message': 'IIITB COMET Website is running'}, 200

# ==================== APPLICATION ENTRY POINT ====================

if __name__ == '__main__':
    # Check if required files exist
    required_files = [
        'index.html',
        'about.html',
        'course-details.html',
        'admission.html',
        'payment.html',
        'styles.css',
        'script.js'
    ]
    
    print("=" * 50)
    print("IIITB COMET Foundation Website")
    print("=" * 50)
    print("\nChecking required files...")
    
    for file in required_files:
        if os.path.exists(file):
            print(f"✓ {file} found")
        else:
            print(f"✗ {file} MISSING!")
    
    print("\n" + "=" * 50)
    print("Starting Flask Development Server...")
    print("=" * 50)
    print("\nAccess your website at:")
    print("  → http://127.0.0.1:5000")
    print("  → http://localhost:5000")
    print("\nPress CTRL+C to stop the server")
    print("=" * 50 + "\n")
    
    # Run the application
    # debug=True allows for automatic reloading on code changes
    # host='0.0.0.0' makes it accessible from other devices on network
    app.run(
        debug=True,
        host='127.0.0.1',  # Change to '0.0.0.0' to allow external access
        port=5000
    )