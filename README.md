# EdgeTTS Web Interface

A web-based interface for Microsoft Edge's Text-to-Speech service that allows you to convert text to speech using various neural voices.

🔗 [Try it live](https://vadash.github.io/EdgeTTS/)

## Features

- Support for multiple file formats:
  - Plain text (.txt)
  - FictionBook (.fb2)
  - EPUB (.epub)
  - ZIP archives containing supported formats
- Rich voice selection with multiple languages and neural voices
- Adjustable speech parameters:
  - Speed control (-50% to +100%)
  - Pitch adjustment (-50Hz to +50Hz)
  - Volume control
- Multi-threaded processing for faster conversion
- Customizable text processing modes (V1, V2, V3) for handling periods and punctuation
- Option to merge multiple MP3 files
- Progress tracking with detailed status updates
- Settings persistence across sessions
- Modern and intuitive user interface

## Usage

1. Open the web interface
2. Select your preferred voice from the dropdown menu
3. Adjust speech parameters (speed, pitch, volume) as needed
4. Either paste your text directly or upload supported file formats
5. Click "Save to MP3" to start the conversion
6. Choose a directory to save the generated audio files

## RVC

Set merge chunk size by 1. Then process with https://docs.applio.org/applio/getting-started/installation

## Credits

This project is a fork of the original [EdgeTTS Web Interface](https://github.com/EdgeTTS/EdgeTTS.github.io) repository.

