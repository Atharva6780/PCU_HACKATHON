from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
import os
import uuid
import pyttsx3  # Free offline TTS
import edge_tts  # Free Microsoft Edge TTS
import asyncio
from TTS.api import TTS
import torch

from translator import MultiLanguageTranslator
from werkzeug.utils import secure_filename
from denoise import remove_noise

app = Flask(__name__)
CORS(app)

# Configure folders
AUDIO_OUTPUT_FOLDER = 'static/audio_output'
PROCESSED_FOLDER = 'processed'
UPLOAD_FOLDER = 'uploads'
os.makedirs(AUDIO_OUTPUT_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['AUDIO_OUTPUT_FOLDER'] = AUDIO_OUTPUT_FOLDER
app.config['PROCESSED_FOLDER'] = PROCESSED_FOLDER
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize TTS model for voice cloning (load only once)
device = "cuda" if torch.cuda.is_available() else "cpu"
try:
    tts_clone = TTS(model_name="tts_models/multilingual/multi-dataset/your_tts").to(device)
except Exception as e:
    print(f"Warning: Could not load voice cloning model. Error: {e}")
    tts_clone = None

# Initialize translator
translator = MultiLanguageTranslator()
ALLOWED_EXTENSIONS = {"wav", "mp3", "flac", "ogg", "m4a"}

# Character Voice Database
CHARACTER_VOICES = {
    "child": {
        "edge_voice": "en-US-AnaNeural",
        "description": "Happy Child (6-8 years)",
        "pyttsx3_settings": {"rate": 180, "pitch": "high"}
    },
    "teen_boy": {
        "edge_voice": "en-US-GuyNeural",
        "description": "Teenage Boy (14-16)",
        "pyttsx3_settings": {"rate": 160, "pitch": "medium"}
    },
    "young_woman": {
        "edge_voice": "en-US-AriaNeural",
        "description": "Young Woman (20s)",
        "pyttsx3_settings": {"rate": 150, "pitch": "medium"}
    },
    "businessman": {
        "edge_voice": "en-US-DavisNeural",
        "description": "Professional Businessman",
        "pyttsx3_settings": {"rate": 140, "pitch": "low"}
    },
    "grandma": {
        "edge_voice": "en-US-JennyNeural",
        "description": "Kind Grandmother",
        "pyttsx3_settings": {"rate": 130, "pitch": "low"}
    },
    "grandpa": {
        "edge_voice": "en-US-JasonNeural",
        "description": "Wise Grandfather",
        "pyttsx3_settings": {"rate": 120, "pitch": "low"}
    },
    "robot": {
        "edge_voice": "en-US-TonyNeural",
        "description": "Futuristic Robot",
        "pyttsx3_settings": {"rate": 110, "pitch": "high"}
    },
    "storyteller": {
        "edge_voice": "en-US-BrianNeural",
        "description": "Dramatic Storyteller",
        "pyttsx3_settings": {"rate": 125, "pitch": "medium"}
    },
    "announcer": {
        "edge_voice": "en-US-EricNeural",
        "description": "Sports Announcer",
        "pyttsx3_settings": {"rate": 145, "pitch": "high"}
    },
    "whisper": {
        "edge_voice": "en-US-JaneNeural",
        "description": "Mysterious Whisper",
        "pyttsx3_settings": {"rate": 100, "pitch": "high"}
    }
}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

class FreeTTS:
    @staticmethod
    def pyttsx3_convert(text, output_file, character):
        """Offline TTS with character customization"""
        try:
            engine = pyttsx3.init()
            
            # Apply character-specific settings
            settings = CHARACTER_VOICES[character]["pyttsx3_settings"]
            engine.setProperty('rate', settings["rate"])
            
            # Adjust pitch (approximation since pyttsx3 doesn't have direct pitch control)
            voices = engine.getProperty('voices')
            if settings["pitch"] == "high":
                engine.setProperty('voice', voices[1].id)  # Typically higher pitch voice
            elif settings["pitch"] == "low":
                engine.setProperty('voice', voices[0].id)  # Typically lower pitch voice
            
            engine.save_to_file(text, output_file)
            engine.runAndWait()
            return True
        except Exception as e:
            print(f"pyttsx3 error: {e}")
            return False

    @staticmethod
    async def edge_tts_convert(text, output_file, character):
        """Online TTS with Edge's neural voices"""
        try:
            voice = CHARACTER_VOICES[character]["edge_voice"]
            communicate = edge_tts.Communicate(text, voice)
            await communicate.save(output_file)
            return True
        except Exception as e:
            print(f"EdgeTTS error: {e}")
            return False

@app.route('/text-to-speech', methods=['POST'])
async def text_to_speech():
    data = request.json
    text = data.get('text')
    character = data.get('character', 'young_woman')
    engine = data.get('engine', 'edge')  # 'edge' or 'pyttsx3'
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    try:
        output_filename = f"tts_{uuid.uuid4()}.mp3"
        output_path = os.path.join(app.config['AUDIO_OUTPUT_FOLDER'], output_filename)
        
        if engine == 'pyttsx3':
            success = FreeTTS.pyttsx3_convert(text, output_path, character)
        else:
            success = await FreeTTS.edge_tts_convert(text, output_path, character)
        
        if not success:
            return jsonify({'error': 'TTS conversion failed'}), 500
            
        return jsonify({
            'audio_url': f"/audio_output/{output_filename}",
            'message': 'Text converted to speech successfully'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/clone-voice', methods=['POST'])
async def clone_voice():
    if 'file' not in request.files or not request.files['file']:
        return jsonify({'error': 'No audio file provided'}), 400
    
    text = request.form.get('text', 'Hello, this is my cloned voice')
    name = request.form.get('name', 'clone')
    
    if not tts_clone:
        return jsonify({'error': 'Voice cloning is not available on this server'}), 501
    
    try:
        # Save uploaded voice sample
        file = request.files['file']
        filename = f"sample_{uuid.uuid4()}.wav"
        sample_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(sample_path)
        
        # Generate output filename
        output_filename = f"clone_{name}_{uuid.uuid4()}.wav"
        output_path = os.path.join(app.config['AUDIO_OUTPUT_FOLDER'], output_filename)
        
        # Perform voice cloning
        tts_clone.tts_to_file(
            text=text,
            speaker_wav=sample_path,
            language="en",
            file_path=output_path
        )
        
        return jsonify({
            'original_sample': f"/uploads/{filename}",
            'cloned_audio': f"/audio_output/{output_filename}",
            'message': 'Voice cloned successfully'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        # Process audio
        output_path = os.path.join(PROCESSED_FOLDER, "cleaned_" + filename)
        remove_noise(filepath, output_path)

        return jsonify({"processed_file": f"/download/cleaned_{filename}"})

    return jsonify({"error": "Invalid file format"}), 400

@app.route("/download/<filename>")
def download_file(filename):
    return send_file(os.path.join(PROCESSED_FOLDER, filename), as_attachment=True)

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

@app.route('/character-voices', methods=['GET'])
def get_character_voices():
    """Return available character voices"""
    simplified_voices = {k: v['description'] for k, v in CHARACTER_VOICES.items()}
    return jsonify(simplified_voices)

@app.route('/languages', methods=['GET'])
def get_languages():
    """Get list of supported languages"""
    languages = translator.get_supported_languages()
    return jsonify(languages)

@app.route('/uploads/<filename>')
def serve_upload(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/audio_output/<filename>')
def serve_audio(filename):
    return send_from_directory(app.config['AUDIO_OUTPUT_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)