from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from translator import MultiLanguageTranslator
import os
from werkzeug.utils import secure_filename
import uuid

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure folders
UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
AUDIO_OUTPUT_FOLDER = 'static/audio_output'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)
os.makedirs(AUDIO_OUTPUT_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PROCESSED_FOLDER'] = PROCESSED_FOLDER
app.config['AUDIO_OUTPUT_FOLDER'] = AUDIO_OUTPUT_FOLDER

translator = MultiLanguageTranslator()

@app.route('/translate', methods=['POST'])
def translate_audio():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        try:
            # Get parameters
            source_lang = request.form.get('source_lang', 'en')
            target_lang = request.form.get('target_lang', 'hi')
            voice_type = int(request.form.get('voice_type', 1))
            
            # Save file
            filename = secure_filename(f"{uuid.uuid4()}_{file.filename}")
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Generate audio output filename
            output_filename = f"translated_{uuid.uuid4()}.mp3"
            output_path = os.path.join(app.config['AUDIO_OUTPUT_FOLDER'], output_filename)
            
            # Use the complete translation pipeline
            result = translator.full_translation_pipeline(
                filepath,
                source_lang,
                target_lang,
                voice_option=voice_type,
                output_audio_path=output_path
            )
            
            # Check for errors
            if 'error' in result:
                return jsonify({'error': result['error']}), 500
                
            # Add audio URL to result
            result['audio_url'] = f"/audio_output/{output_filename}"
            
            return jsonify(result)
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500

@app.route('/audio_output/<filename>')
def serve_audio(filename):
    return send_from_directory(app.config['AUDIO_OUTPUT_FOLDER'], filename)

@app.route('/languages', methods=['GET'])
def get_languages():
    """Get list of supported languages"""
    languages = translator.get_supported_languages()
    return jsonify(languages)

if __name__ == '__main__':
    app.run(debug=True)