# Sample Files for Webhook Testing

This directory contains various sample files that you can use to test webhook file upload functionality.

## Files Included

### 1. `sample.txt`
- **Type**: Plain text
- **Size**: Small (~300 bytes)
- **Purpose**: Basic text file testing
- **Content**: Simple multi-line text with special characters and unicode

### 2. `sample.json`
- **Type**: JSON
- **Size**: Medium (~800 bytes)
- **Purpose**: Structured data testing
- **Content**: User data, settings, and metadata

### 3. `sample.csv`
- **Type**: CSV
- **Size**: Small (~400 bytes)
- **Purpose**: Tabular data testing
- **Content**: User information in comma-separated format

### 4. `sample.xml`
- **Type**: XML
- **Size**: Medium (~700 bytes)
- **Purpose**: XML structure testing
- **Content**: Product catalog with configuration settings

### 5. `large-sample.txt`
- **Type**: Plain text
- **Size**: Large (~2KB)
- **Purpose**: Testing file size limits and larger uploads
- **Content**: Extended text with multiple sections and repeated content

## Usage

Use these files to test various aspects of your webhook:

1. **File type handling**: Different MIME types (text, JSON, CSV, XML)
2. **File size limits**: From small (300B) to larger (2KB) files
3. **Content parsing**: Various data formats and structures
4. **Character encoding**: Unicode and special characters
5. **Error handling**: Upload different file types to test validation

## Testing Tips

- Start with `sample.txt` for basic functionality
- Use `sample.json` to test JSON parsing
- Try `large-sample.txt` to test size limits
- Upload multiple files simultaneously to test batch processing
- Test with unsupported file types to verify error handling 